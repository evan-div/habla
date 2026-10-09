import { getLesson, unitOfLesson } from "@/content/course";
import { getVocab } from "@/content/vocabulary";
import { achievementStatuses } from "@/lib/gamification/achievements";
import { levelForXp } from "@/lib/gamification/levels";
import { computeSessionXp, firstAttempts, isPerfect } from "@/lib/gamification/xp";
import { applyAnswer, applyIntroduction, createWordProgress, masteryAt, type WordAnswer } from "@/lib/mastery/mastery";
import { isDue, schedule, sessionQuality, type SessionAttempt } from "@/lib/srs/scheduler";
import { dateKey } from "@/lib/util/dates";
import { achievementStats, activityOn, completedUnitIds, streakOf } from "./selectors";
import type { DailyActivity, GrammarProgress, LearnerState, SessionPayload, SessionSummary, WordProgress } from "./types";

const GRAMMAR_RECENT_WINDOW = 10;

/** Group a session's answers by vocabulary word, preserving order. */
function answersByWord(payload: SessionPayload): Map<string, WordAnswer[]> {
  const byWord = new Map<string, WordAnswer[]>();
  for (const a of payload.answers) {
    for (const id of a.vocabIds) {
      const vocab = getVocab(id);
      if (!vocab) continue;
      // Matching rounds forgive one slip overall, but the fumbled words still count as misses.
      const correct = a.correct && !a.missedVocabIds?.includes(id);
      const list = byWord.get(id) ?? [];
      list.push({ correct, recall: a.recall, difficulty: vocab.difficulty });
      byWord.set(id, list);
    }
  }
  return byWord;
}

function updateWords(state: LearnerState, payload: SessionPayload, now: number) {
  const words: Record<string, WordProgress> = { ...state.words };
  const newWordIds: string[] = [];
  const strengthenedWordIds: string[] = [];
  const origin = payload.lessonId ?? "review";
  const byWord = answersByWord(payload);
  const introduced = new Set(payload.introducedVocabIds);

  const touched = new Set<string>([...introduced, ...byWord.keys()]);
  for (const id of touched) {
    if (!getVocab(id)) continue;
    const before = words[id];
    const isNew = !before;
    let word = before ?? createWordProgress(id, origin, now);
    if (isNew) newWordIds.push(id);
    const masteryBefore = before ? masteryAt(before, now) : 0;

    if (introduced.has(id)) word = applyIntroduction(word, now);

    const outcomes = byWord.get(id) ?? [];
    for (const outcome of outcomes) word = applyAnswer(word, outcome, now);

    const attempts: SessionAttempt[] = outcomes.map((o) => ({ correct: o.correct, recall: o.recall }));
    const quality = sessionQuality(attempts);
    const wasDue = isNew || isDue(word, now);
    word = { ...word, ...schedule(word, quality, now, wasDue) };
    word.masteryScore = masteryAt(word, now);

    if (before && word.masteryScore > masteryBefore) strengthenedWordIds.push(id);
    words[id] = word;
  }
  return { words, newWordIds, strengthenedWordIds };
}

function updateGrammar(state: LearnerState, payload: SessionPayload, now: number): Record<string, GrammarProgress> {
  const grammar = { ...state.grammar };
  const ensure = (id: string): GrammarProgress =>
    (grammar[id] ??= { grammarId: id, learnedAt: now, attempts: 0, correct: 0, recent: [], lastPracticed: null });

  for (const id of payload.seenGrammarIds) ensure(id);
  for (const a of firstAttempts(payload.answers)) {
    for (const id of a.grammarIds) {
      const g = ensure(id);
      grammar[id] = {
        ...g,
        attempts: g.attempts + 1,
        correct: g.correct + (a.correct ? 1 : 0),
        recent: [...g.recent, a.correct].slice(-GRAMMAR_RECENT_WINDOW),
        lastPracticed: now,
      };
    }
  }
  return grammar;
}

/**
 * Fold a finished lesson / review into the learner's state.
 * Pure: returns the next state plus a summary for the completion screen.
 */
export function applySession(
  state: LearnerState,
  payload: SessionPayload,
  now: number,
): { state: LearnerState; summary: SessionSummary } {
  const today = dateKey(now);
  const lesson = payload.lessonId ? getLesson(payload.lessonId) : undefined;
  const previous = payload.lessonId ? state.lessons[payload.lessonId] : undefined;
  // A lesson skipped by placement still pays full XP the first time it's actually played.
  const isRepeat = payload.kind === "lesson" && Boolean(previous && !previous.placedOut);

  const streakBefore = streakOf(state, now);
  const levelBefore = levelForXp(state.totalXp);
  const unlockedBefore = new Set(Object.keys(state.achievements));
  const unitsDoneBefore = new Set(completedUnitIds(state));
  const dailyBefore = activityOn(state, today).xp;

  /* words & grammar */
  const { words, newWordIds, strengthenedWordIds } = updateWords(state, payload, now);
  const grammar = updateGrammar(state, payload, now);

  /* xp */
  const xp = computeSessionXp(payload.answers, payload.kind, isRepeat);
  const scored = firstAttempts(payload.answers);
  const perfect = isPerfect(xp.accuracy, xp.totalCount);

  /* daily activity */
  const day: DailyActivity = activityOn(state, today);
  const activity: Record<string, DailyActivity> = {
    ...state.activity,
    [today]: {
      ...day,
      xp: day.xp + xp.total,
      seconds: day.seconds + payload.durationSeconds,
      lessons: day.lessons + (payload.kind === "lesson" ? 1 : 0),
      reviews: day.reviews + (payload.kind === "lesson" ? 0 : 1),
      newWords: day.newWords + newWordIds.length,
      correct: day.correct + xp.correctCount,
      incorrect: day.incorrect + (xp.totalCount - xp.correctCount),
    },
  };

  /* lesson progress */
  const lessons = { ...state.lessons };
  if (payload.kind === "lesson" && payload.lessonId) {
    const accuracy = xp.accuracy ?? 1;
    lessons[payload.lessonId] = previous && !previous.placedOut
      ? { ...previous, lastCompletedAt: now, timesCompleted: previous.timesCompleted + 1, lastAccuracy: accuracy, bestAccuracy: Math.max(previous.bestAccuracy, accuracy) }
      : { lessonId: payload.lessonId, firstCompletedAt: now, lastCompletedAt: now, timesCompleted: 1, bestAccuracy: accuracy, lastAccuracy: accuracy };
  }

  /* counters */
  const dailyGoalHit = dailyBefore < state.profile.dailyGoalXp && dailyBefore + xp.total >= state.profile.dailyGoalXp;
  const counters = {
    ...state.counters,
    reviewCardsCompleted: state.counters.reviewCardsCompleted + (payload.kind === "lesson" ? 0 : xp.totalCount),
    reviewCorrect: state.counters.reviewCorrect + (payload.kind === "lesson" ? 0 : xp.correctCount),
    reviewSessions: state.counters.reviewSessions + (payload.kind === "lesson" ? 0 : 1),
    perfectLessons: state.counters.perfectLessons + (payload.kind === "lesson" && perfect ? 1 : 0),
    realTalkLessons: state.counters.realTalkLessons + (payload.kind === "lesson" && lesson?.kind === "real-talk" && !isRepeat ? 1 : 0),
    dailyGoalsHit: state.counters.dailyGoalsHit + (dailyGoalHit ? 1 : 0),
  };

  const totalXp = state.totalXp + xp.total;
  let next: LearnerState = { ...state, words, grammar, lessons, activity, counters, totalXp };

  /* achievements (evaluated against the *new* state) */
  const statuses = achievementStatuses(achievementStats(next, now));
  const newAchievementIds = statuses.filter((s) => s.unlocked && !unlockedBefore.has(s.def.id)).map((s) => s.def.id);
  if (newAchievementIds.length > 0) {
    const achievements = { ...next.achievements };
    for (const id of newAchievementIds) achievements[id] = { unlockedAt: now };
    next = { ...next, achievements };
  }

  const streakAfter = streakOf(next, now);
  const unitId = lesson ? unitOfLesson(lesson.id)?.id : undefined;
  const completedUnitId = unitId && !unitsDoneBefore.has(unitId) && completedUnitIds(next).includes(unitId) ? unitId : null;

  const summary: SessionSummary = {
    kind: payload.kind,
    lessonId: payload.lessonId,
    accuracy: xp.accuracy,
    correctCount: xp.correctCount,
    totalCount: scored.length,
    xpLines: xp.lines,
    xpTotal: xp.total,
    newWordIds,
    strengthenedWordIds,
    streak: { current: streakAfter.current, longest: streakAfter.longest, increased: streakAfter.current > streakBefore.current },
    newAchievementIds,
    level: { before: levelBefore, after: levelForXp(totalXp) },
    dailyGoal: { before: dailyBefore, after: dailyBefore + xp.total, target: state.profile.dailyGoalXp, justReached: dailyGoalHit },
    mistakes: payload.mistakes,
    isFirstCompletion: payload.kind === "lesson" && !isRepeat,
    completedUnitId,
  };

  return { state: next, summary };
}

