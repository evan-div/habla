import { XP_RULES } from "@/config/xp";
import { achievementStatuses } from "@/lib/gamification/achievements";
import { levelForXp } from "@/lib/gamification/levels";
import { achievementStats, activityOn, streakOf } from "@/lib/state/selectors";
import type { DailyActivity, DojoState, DojoVerbStat, LearnerState, XpLine } from "@/lib/state/types";
import { dateKey } from "@/lib/util/dates";
import { getBelt } from "./catalog";
import { statKey } from "./prompts";
import { scoredAnswers, type DojoAnswer, type DojoMode } from "./session";

export interface DojoPayload {
  mode: DojoMode;
  answers: DojoAnswer[];
  durationSeconds: number;
  /** Sparring points. */
  score: number;
  bestCombo: number;
  /** Belt tests: which belt, and whether it was passed. */
  beltId?: string;
  passed?: boolean;
}

export interface DojoSummary {
  mode: DojoMode;
  correctCount: number;
  totalCount: number;
  accuracy: number | null;
  xpLines: XpLine[];
  xpTotal: number;
  /** Today's Dojo answer XP is used up. */
  xpCapped: boolean;
  score: number;
  bestCombo: number;
  previousBestScore: number;
  newHighScore: boolean;
  beltId?: string;
  passed?: boolean;
  /** The belt was earned just now (not a re-take). */
  beltEarned: boolean;
  streak: { current: number; increased: boolean };
  level: { before: number; after: number };
  dailyGoal: { after: number; target: number; justReached: boolean };
  newAchievementIds: string[];
}

function updateStats(stats: Record<string, DojoVerbStat>, answers: readonly DojoAnswer[], now: number): Record<string, DojoVerbStat> {
  const next = { ...stats };
  for (const a of answers) {
    const key = statKey(a.verbId, a.tense);
    const s = next[key] ?? { attempts: 0, correct: 0, lastAt: now };
    next[key] = { attempts: s.attempts + 1, correct: s.correct + (a.correct ? 1 : 0), lastAt: now };
  }
  return next;
}

/** Fold a finished Dojo session into the learner's state. Pure, like applySession. */
export function applyDojoSession(state: LearnerState, payload: DojoPayload, now: number): { state: LearnerState; summary: DojoSummary } {
  const today = dateKey(now);
  const scored = scoredAnswers(payload.answers);
  const correctCount = scored.filter((a) => a.correct).length;
  const practiced = scored.length > 0;

  const streakBefore = streakOf(state, now);
  const levelBefore = levelForXp(state.totalXp);
  const unlockedBefore = new Set(Object.keys(state.achievements));
  const day: DailyActivity = activityOn(state, today);

  /* xp: per-answer XP is capped per day; earning a belt is a one-time bonus */
  const rules = XP_RULES.dojo;
  const room = Math.max(0, rules.dailyCap - (day.dojoXp ?? 0));
  const answerXp = Math.min(correctCount * rules.correctAnswer, room);
  const belt = payload.beltId ? getBelt(payload.beltId) : undefined;
  const beltEarned = Boolean(belt && payload.passed && !state.dojo.belts[belt.id]);
  const xpLines: XpLine[] = [];
  if (answerXp > 0) xpLines.push({ label: "Correct answers", xp: answerXp });
  if (beltEarned && belt) xpLines.push({ label: belt.name, xp: rules.beltEarned });
  const xpTotal = xpLines.reduce((sum, l) => sum + l.xp, 0);

  const activity: Record<string, DailyActivity> = {
    ...state.activity,
    [today]: {
      ...day,
      xp: day.xp + xpTotal,
      seconds: day.seconds + payload.durationSeconds,
      correct: day.correct + correctCount,
      incorrect: day.incorrect + (scored.length - correctCount),
      dojoSessions: (day.dojoSessions ?? 0) + (practiced ? 1 : 0),
      dojoXp: (day.dojoXp ?? 0) + answerXp,
    },
  };

  const previousBestScore = state.dojo.bestSparScore;
  const newHighScore = payload.mode === "spar" && payload.score > previousBestScore;
  const dojo: DojoState = {
    ...state.dojo,
    stats: updateStats(state.dojo.stats, scored, now),
    sessions: state.dojo.sessions + (practiced ? 1 : 0),
    bestSparScore: newHighScore ? payload.score : previousBestScore,
    bestCombo: payload.mode === "spar" ? Math.max(state.dojo.bestCombo, payload.bestCombo) : state.dojo.bestCombo,
    beltAttempts: state.dojo.beltAttempts + (payload.mode === "belt" ? 1 : 0),
    belts: beltEarned && belt ? { ...state.dojo.belts, [belt.id]: { earnedAt: now } } : state.dojo.belts,
  };

  const dailyBefore = day.xp;
  const target = state.profile.dailyGoalXp;
  const dailyGoalHit = dailyBefore < target && dailyBefore + xpTotal >= target;
  const counters = { ...state.counters, dailyGoalsHit: state.counters.dailyGoalsHit + (dailyGoalHit ? 1 : 0) };

  const totalXp = state.totalXp + xpTotal;
  let next: LearnerState = { ...state, dojo, activity, counters, totalXp };

  const newAchievementIds = achievementStatuses(achievementStats(next, now))
    .filter((s) => s.unlocked && !unlockedBefore.has(s.def.id))
    .map((s) => s.def.id);
  if (newAchievementIds.length > 0) {
    const achievements = { ...next.achievements };
    for (const id of newAchievementIds) achievements[id] = { unlockedAt: now };
    next = { ...next, achievements };
  }

  const streakAfter = streakOf(next, now);
  return {
    state: next,
    summary: {
      mode: payload.mode,
      correctCount,
      totalCount: scored.length,
      accuracy: practiced ? correctCount / scored.length : null,
      xpLines,
      xpTotal,
      xpCapped: correctCount * rules.correctAnswer > answerXp,
      score: payload.score,
      bestCombo: payload.bestCombo,
      previousBestScore,
      newHighScore,
      beltId: payload.beltId,
      passed: payload.passed,
      beltEarned,
      streak: { current: streakAfter.current, increased: streakAfter.current > streakBefore.current },
      level: { before: levelBefore, after: levelForXp(totalXp) },
      dailyGoal: { after: dailyBefore + xpTotal, target, justReached: dailyGoalHit },
      newAchievementIds,
    },
  };
}
