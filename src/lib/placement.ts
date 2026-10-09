import { ALL_LESSONS, ALL_UNITS, grammarTaught, introducedWordIds } from "@/content/course";
import { masteryAt } from "@/lib/mastery/mastery";
import type { GrammarProgress, LearnerState, WordProgress } from "@/lib/state/types";
import { DAY } from "@/lib/util/dates";

/** Words from skipped lessons start at a modest mastery and trickle into review over this many days. */
const REVIEW_SPREAD_DAYS = 6;
const ASSUMED_STRENGTH = 0.45;

export interface LevelOutcome {
  unitNumber: number;
  /** Both questions answered correctly. */
  passed: boolean;
}

/** The unit to start at: the first level not passed, or the newest unit if all were. */
export function recommendedStart(outcomes: LevelOutcome[], lastUnitNumber: number): number {
  const failed = outcomes.find((o) => !o.passed);
  return failed ? failed.unitNumber : lastUnitNumber;
}

/** Playable lessons and words that starting at `startUnitNumber` would skip. */
export function skipSummary(startUnitNumber: number) {
  const skipped = ALL_LESSONS.filter((l) => {
    const unit = ALL_UNITS.find((u) => u.id === l.unitId);
    return unit ? unit.number < startUnitNumber : false;
  });
  const words = new Set(skipped.flatMap((l) => introducedWordIds(l.exercises)));
  return { lessons: skipped, wordCount: words.size };
}

/**
 * Start at a later unit: mark earlier lessons as placed out, and add their words (and grammar)
 * to the learner's library at moderate mastery, spread over the next few days of review so the
 * assumption gets checked gently. Never touches lessons the learner has already played.
 */
export function applyPlacement(
  state: LearnerState,
  startUnitNumber: number,
  score: { correct: number; answered: number },
  now: number,
): LearnerState {
  const { lessons: skipped } = skipSummary(startUnitNumber);
  const lessons = { ...state.lessons };
  const words = { ...state.words };
  const grammar: Record<string, GrammarProgress> = { ...state.grammar };
  let n = 0;

  for (const lesson of skipped) {
    if (!lessons[lesson.id]) {
      lessons[lesson.id] = { lessonId: lesson.id, firstCompletedAt: now, lastCompletedAt: now, timesCompleted: 0, bestAccuracy: 0, lastAccuracy: 0, placedOut: true };
    }
    for (const id of introducedWordIds(lesson.exercises)) {
      if (words[id]) continue;
      const word: WordProgress = {
        vocabId: id,
        introducedInLesson: lesson.id,
        createdAt: now,
        timesSeen: 2,
        timesCorrect: 0,
        timesIncorrect: 0,
        strength: ASSUMED_STRENGTH,
        masteryScore: 0,
        lastReviewed: now,
        lastIncorrectAt: null,
        nextReview: now + (1 + (n++ % REVIEW_SPREAD_DAYS)) * DAY,
        intervalDays: 3,
        ease: 2.5,
        repetitions: 1,
        lapses: 0,
      };
      word.masteryScore = masteryAt(word, now);
      words[id] = word;
    }
    for (const g of grammarTaught(lesson)) {
      grammar[g] ??= { grammarId: g, learnedAt: now, attempts: 0, correct: 0, recent: [], lastPracticed: null };
    }
  }

  return { ...state, lessons, words, grammar, placement: { completedAt: now, startUnitNumber, ...score } };
}
