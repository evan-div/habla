/** Tunables for the SM-2-inspired scheduler (see lib/srs). */
export const SRS_CONFIG = {
  startEase: 2.5,
  minEase: 1.3,
  maxEase: 3.0,
  /** Days until the 1st and 2nd successful review. */
  firstInterval: 1,
  secondInterval: 3,
  /** After a miss the word comes back soon (in minutes). */
  lapseRetryMinutes: 10,
  /** Intervals never exceed this many days. */
  maxIntervalDays: 180,
  /** Words per review session. */
  sessionSize: 15,
  maxSessionSize: 20,
  /** Practice mode (nothing due) pulls this many of the weakest words. */
  practiceSize: 10,
} as const;
