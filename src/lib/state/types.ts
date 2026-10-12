import type { ExerciseType } from "@/content/types";
import type { RecallKind } from "@/config/mastery";
import type { Tense } from "@/lib/conjugate/conjugate";

export type SelfLevel = "new" | "few-words" | "basic" | "simple-conversations";
export type Reason =
  | "travel"
  | "conversation"
  | "fluency"
  | "family"
  | "work"
  | "culture"
  | "other";

/** How much English the interface shows. Designed to taper as skill grows. */
export type TranslationSupport = "full" | "tap" | "minimal";
export type ThemePreference = "system" | "light" | "dark";

export interface Profile {
  displayName: string;
  selfLevel: SelfLevel;
  reasons: Reason[];
  dailyGoalXp: number;
  onboardedAt: number | null;
}

export interface Settings {
  translationSupport: TranslationSupport;
  autoPlayAudio: boolean;
  defaultAudioSpeed: "slow" | "normal";
  theme: ThemePreference;
  /** Let learners jump to any lesson instead of unlocking in order. */
  openCourse: boolean;
}

/** Per-word learning record. Static word data lives in content/vocabulary. */
export interface WordProgress {
  vocabId: string;
  introducedInLesson: string;
  createdAt: number;
  timesSeen: number;
  timesCorrect: number;
  timesIncorrect: number;
  /** Recall strength 0–1, updated on every answer. */
  strength: number;
  /** Mastery 0–100 as of `lastReviewed` (time decay is applied on read). */
  masteryScore: number;
  lastReviewed: number | null;
  lastIncorrectAt: number | null;
  nextReview: number;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
}

export interface GrammarProgress {
  grammarId: string;
  /** First time the explanation was shown. */
  learnedAt: number;
  attempts: number;
  correct: number;
  /** Most recent results, newest last (capped). */
  recent: boolean[];
  lastPracticed: number | null;
}

export interface LessonProgress {
  lessonId: string;
  firstCompletedAt: number;
  lastCompletedAt: number;
  timesCompleted: number;
  bestAccuracy: number;
  lastAccuracy: number;
  /** Skipped via the placement check rather than played. */
  placedOut?: boolean;
}

export interface DailyActivity {
  date: string;
  xp: number;
  seconds: number;
  lessons: number;
  reviews: number;
  newWords: number;
  correct: number;
  incorrect: number;
  /** Conjugation Dojo sessions finished (they count toward the streak). */
  dojoSessions?: number;
  /** XP from Dojo answers, which is capped per day. */
  dojoXp?: number;
}

export interface Counters {
  reviewCardsCompleted: number;
  reviewCorrect: number;
  reviewSessions: number;
  perfectLessons: number;
  realTalkLessons: number;
  dailyGoalsHit: number;
}

export interface PlacementRecord {
  completedAt: number;
  /** Unit number the learner chose to start at. */
  startUnitNumber: number;
  correct: number;
  answered: number;
}

/** Which verbs the Dojo draws from. */
export type DojoFocus = "all" | "tricky" | "weak";

export interface DojoVerbStat {
  attempts: number;
  correct: number;
  lastAt: number;
}

export interface DojoState {
  /** Belts earned, by belt id. */
  belts: Record<string, { earnedAt: number }>;
  beltAttempts: number;
  sessions: number;
  bestSparScore: number;
  /** Longest run of right answers in a sparring round. */
  bestCombo: number;
  /** First-try results per verb and tense, keyed `${verbId}:${tense}`. */
  stats: Record<string, DojoVerbStat>;
  /** Last tense pick for training and sparring (empty = everything unlocked). */
  tenses: Tense[];
  focus: DojoFocus;
}

export interface LearnerState {
  version: number;
  userId: string;
  profile: Profile;
  settings: Settings;
  totalXp: number;
  words: Record<string, WordProgress>;
  grammar: Record<string, GrammarProgress>;
  lessons: Record<string, LessonProgress>;
  activity: Record<string, DailyActivity>;
  achievements: Record<string, { unlockedAt: number }>;
  counters: Counters;
  placement: PlacementRecord | null;
  dojo: DojoState;
  /** Developer tool: shifts "now" so spaced repetition can be tested. */
  clockOffsetMs: number;
}

/* ---- Session results ---------------------------------------------- */

export interface AnswerRecord {
  exerciseId: string;
  type: ExerciseType;
  vocabIds: string[];
  grammarIds: string[];
  correct: boolean;
  /** Accepted despite a small slip (accent / typo). */
  close?: boolean;
  recall: RecallKind;
  /** Second attempt of a previously missed exercise. */
  retry: boolean;
  /** For multi-word exercises (matching): words the learner fumbled. */
  missedVocabIds?: string[];
}

export interface MistakeRecord {
  exerciseId: string;
  prompt: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation?: string;
}

export type SessionKind = "lesson" | "review" | "practice";

export interface SessionPayload {
  kind: SessionKind;
  lessonId?: string;
  answers: AnswerRecord[];
  introducedVocabIds: string[];
  seenGrammarIds: string[];
  durationSeconds: number;
  mistakes: MistakeRecord[];
}

export interface XpLine {
  label: string;
  xp: number;
}

export interface SessionSummary {
  kind: SessionKind;
  lessonId?: string;
  accuracy: number | null;
  correctCount: number;
  totalCount: number;
  xpLines: XpLine[];
  xpTotal: number;
  newWordIds: string[];
  strengthenedWordIds: string[];
  streak: { current: number; longest: number; increased: boolean };
  newAchievementIds: string[];
  level: { before: number; after: number };
  dailyGoal: { before: number; after: number; target: number; justReached: boolean };
  mistakes: MistakeRecord[];
  isFirstCompletion: boolean;
  completedUnitId: string | null;
}
