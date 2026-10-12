/** Every XP number in the product lives here so tuning is a one-file change. */
export const XP_RULES = {
  /** Awarded for each correct first attempt. */
  correctAnswer: 2,
  /** Every Nth correct answer in a row adds a small bonus. */
  streakBonus: { every: 5, bonus: 3 },
  lessonComplete: 25,
  perfectLesson: 15,
  reviewSession: 20,
  perfectReview: 10,
  /** Replaying a finished lesson still pays, just less — keeps XP honest. */
  repeatLessonFactor: 0.5,
  /** Conjugation Dojo: small per-answer XP with a daily cap, so drilling never replaces lessons. */
  dojo: { correctAnswer: 1, dailyCap: 60, beltEarned: 30 },
} as const;

export const DAILY_GOAL_OPTIONS = [
  { xp: 50, label: "Casual", detail: "About one lesson" },
  { xp: 100, label: "Regular", detail: "A lesson and a review" },
  { xp: 200, label: "Serious", detail: "Two to three lessons" },
  { xp: 300, label: "Intense", detail: "A real study session" },
] as const;

export const DEFAULT_DAILY_GOAL_XP = 100;
