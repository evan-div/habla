import { RECALL_WEIGHT, type RecallKind } from "@/config/mastery";
import { SRS_CONFIG as S } from "@/config/srs";
import type { WordProgress } from "@/lib/state/types";
import { DAY, MINUTE } from "@/lib/util/dates";

/** SM-2 quality grades we use: 5 = easy production, 4 = recognised, 3 = needed a retry, 1 = missed. */
export type Quality = 5 | 4 | 3 | 1;

export interface SessionAttempt {
  correct: boolean;
  recall: RecallKind;
}

/**
 * A word may be tested several times in one lesson. Scheduling advances only
 * once per session, judged by how that session ended (SM-2's "learning steps").
 */
export function sessionQuality(attempts: SessionAttempt[]): Quality {
  if (attempts.length === 0) return 4;
  const last = attempts[attempts.length - 1];
  if (!last.correct) return 1;
  if (attempts.some((a) => !a.correct)) return 3;
  const demanding = attempts.some((a) => RECALL_WEIGHT[a.recall] >= 0.85);
  return demanding ? 5 : 4;
}

export function isDue(word: Pick<WordProgress, "nextReview">, now: number): boolean {
  return word.nextReview <= now;
}

/** SM-2 ease update. */
function nextEase(ease: number, q: Quality): number {
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  return Math.min(S.maxEase, Math.max(S.minEase, ease + delta));
}

type ScheduleFields = Pick<
  WordProgress,
  "nextReview" | "intervalDays" | "ease" | "repetitions" | "lapses"
>;

/**
 * Compute the next scheduling state after a session.
 * `wasDue` is false when the learner practiced early — successes then leave the
 * schedule alone (no cramming the intervals upward), but misses always count.
 */
export function schedule(
  word: Pick<WordProgress, keyof ScheduleFields>,
  quality: Quality,
  now: number,
  wasDue: boolean,
): ScheduleFields {
  if (quality === 1) {
    return {
      repetitions: 0,
      lapses: word.lapses + 1,
      ease: nextEase(word.ease, quality),
      intervalDays: S.firstInterval,
      nextReview: now + S.lapseRetryMinutes * MINUTE,
    };
  }

  if (!wasDue) return pick(word);

  const repetitions = word.repetitions + 1;
  const ease = nextEase(word.ease, quality);
  let intervalDays: number;
  if (repetitions === 1) intervalDays = S.firstInterval;
  else if (repetitions === 2) intervalDays = S.secondInterval;
  else intervalDays = Math.round(Math.max(word.intervalDays, 1) * ease * (quality === 3 ? 0.8 : 1));
  intervalDays = Math.min(S.maxIntervalDays, Math.max(1, intervalDays));

  return { repetitions, ease, intervalDays, lapses: word.lapses, nextReview: now + intervalDays * DAY };
}

function pick(word: Pick<WordProgress, keyof ScheduleFields>): ScheduleFields {
  return {
    nextReview: word.nextReview,
    intervalDays: word.intervalDays,
    ease: word.ease,
    repetitions: word.repetitions,
    lapses: word.lapses,
  };
}
