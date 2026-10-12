import { ALL_LESSONS, ALL_UNITS, getUnit, sectionOfUnit } from "@/content/course";
import type { Lesson, Section, Unit, VocabEntry } from "@/content/types";
import { getVocab } from "@/content/vocabulary";
import { achievementStatuses, type AchievementStats } from "@/lib/gamification/achievements";
import { levelForXp } from "@/lib/gamification/levels";
import { computeStreak, type StreakInfo } from "@/lib/gamification/streak";
import { masteryAt, masteryBand, type MasteryBand } from "@/lib/mastery/mastery";
import { isDue } from "@/lib/srs/scheduler";
import { DAY, dateKey, lastNDayKeys } from "@/lib/util/dates";
import type { DailyActivity, LearnerState, WordProgress } from "./types";

const EMPTY_DAY = (date: string): DailyActivity => ({ date, xp: 0, seconds: 0, lessons: 0, reviews: 0, newWords: 0, correct: 0, incorrect: 0 });

/* ---- Activity & streak -------------------------------------------- */

export function activeDayKeys(state: LearnerState): string[] {
  return Object.values(state.activity)
    .filter((d) => d.lessons + d.reviews + (d.dojoSessions ?? 0) > 0)
    .map((d) => d.date);
}

export function streakOf(state: LearnerState, now: number): StreakInfo {
  return computeStreak(activeDayKeys(state), dateKey(now));
}

export function activityOn(state: LearnerState, key: string): DailyActivity {
  return state.activity[key] ?? EMPTY_DAY(key);
}

export function todayActivity(state: LearnerState, now: number): DailyActivity {
  return activityOn(state, dateKey(now));
}

export function recentActivity(state: LearnerState, now: number, days: number): DailyActivity[] {
  return lastNDayKeys(dateKey(now), days).map((k) => activityOn(state, k));
}

/* ---- Words --------------------------------------------------------- */

/** A vocabulary entry joined with the learner's progress on it. */
export interface LearnedWord {
  vocab: VocabEntry;
  progress: WordProgress;
  mastery: number;
  band: MasteryBand;
  due: boolean;
}

export function learnedWords(state: LearnerState, now: number): LearnedWord[] {
  const out: LearnedWord[] = [];
  for (const progress of Object.values(state.words)) {
    const vocab = getVocab(progress.vocabId);
    if (!vocab) continue;
    const mastery = masteryAt(progress, now);
    out.push({ vocab, progress, mastery, band: masteryBand(mastery), due: isDue(progress, now) });
  }
  return out;
}

export interface ReviewStats {
  due: number;
  weakDue: number;
  recentlyMissed: number;
  newWords: number;
}

export function reviewStats(words: LearnedWord[], now: number): ReviewStats {
  const due = words.filter((w) => w.due);
  return {
    due: due.length,
    weakDue: due.filter((w) => w.band === "weak").length,
    recentlyMissed: due.filter((w) => w.progress.lastIncorrectAt !== null && now - w.progress.lastIncorrectAt < 2 * DAY).length,
    newWords: due.filter((w) => w.progress.timesSeen <= 3).length,
  };
}

/* ---- Course progress ---------------------------------------------- */

export function isLessonCompleted(state: LearnerState, lessonId: string): boolean {
  return Boolean(state.lessons[lessonId]);
}

export type LessonStatus = "locked" | "available" | "completed";

export function lessonStatus(state: LearnerState, lessonId: string): LessonStatus {
  if (isLessonCompleted(state, lessonId)) return "completed";
  const index = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (index < 0) return "locked";
  if (state.settings.openCourse || index === 0) return "available";
  return isLessonCompleted(state, ALL_LESSONS[index - 1].id) ? "available" : "locked";
}

export interface UpNext {
  lesson: Lesson;
  unit: Unit;
  section: Section;
  /** 1-based position inside the unit. */
  position: number;
  unitLessonCount: number;
}

/** The first lesson the learner hasn't completed. null when every playable lesson is done. */
export function nextLesson(state: LearnerState): UpNext | null {
  const lesson = ALL_LESSONS.find((l) => !isLessonCompleted(state, l.id));
  if (!lesson) return null;
  const unit = getUnit(lesson.unitId)!;
  const section = sectionOfUnit(unit.id)!;
  return { lesson, unit, section, position: unit.lessons.findIndex((l) => l.id === lesson.id) + 1, unitLessonCount: unit.lessons.length };
}

export function unitProgress(state: LearnerState, unit: Unit): { completed: number; total: number; done: boolean } {
  const completed = unit.lessons.filter((l) => isLessonCompleted(state, l.id)).length;
  return { completed, total: unit.lessons.length, done: unit.lessons.length > 0 && completed === unit.lessons.length };
}

export function completedUnitIds(state: LearnerState): string[] {
  return ALL_UNITS.filter((u) => unitProgress(state, u).done).map((u) => u.id);
}

/** Lessons the learner actually played (excludes lessons skipped by placement). */
export function lessonsCompletedCount(state: LearnerState): number {
  return Object.values(state.lessons).filter((l) => !l.placedOut).length;
}

/** Lessons marked done, played or skipped — for course progress bars. */
export function lessonsDoneCount(state: LearnerState): number {
  return Object.keys(state.lessons).length;
}

/** Units finished by playing — a unit skipped entirely by placement doesn't count as an achievement. */
export function unitsCompletedByPlay(state: LearnerState): string[] {
  return ALL_UNITS.filter((u) => unitProgress(state, u).done && u.lessons.some((l) => !state.lessons[l.id]?.placedOut)).map((u) => u.id);
}

/* ---- Gamification ------------------------------------------------- */

export function achievementStats(state: LearnerState, now: number): AchievementStats {
  const words = learnedWords(state, now);
  const streak = streakOf(state, now);
  return {
    lessonsCompleted: lessonsCompletedCount(state),
    perfectLessons: state.counters.perfectLessons,
    wordsLearned: words.length,
    wordsMastered: words.filter((w) => w.band === "strong").length,
    verbsLearned: words.filter((w) => w.vocab.verb).length,
    grammarLearned: Object.keys(state.grammar).length,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    reviewCardsCompleted: state.counters.reviewCardsCompleted,
    unitsCompleted: unitsCompletedByPlay(state),
    realTalkLessons: state.counters.realTalkLessons,
    dailyGoalsHit: state.counters.dailyGoalsHit,
    level: levelForXp(state.totalXp),
    beltsEarned: Object.keys(state.dojo.belts).length,
  };
}

export function achievementsOf(state: LearnerState, now: number) {
  return achievementStatuses(achievementStats(state, now));
}

/* ---- Grammar ------------------------------------------------------- */

export function grammarMastery(progress: { attempts: number; recent: boolean[] } | undefined): number {
  if (!progress || progress.recent.length === 0) return 0;
  const accuracy = progress.recent.filter(Boolean).length / progress.recent.length;
  const confidence = Math.min(1, progress.attempts / 6);
  return Math.round(100 * accuracy * confidence);
}

/** Grammar concepts the learner keeps missing (≥ 3 attempts, < 70% recent accuracy). */
export function weakGrammar(state: LearnerState): Array<{ grammarId: string; accuracy: number; attempts: number }> {
  return Object.values(state.grammar)
    .filter((g) => g.attempts >= 3 && g.recent.length >= 3)
    .map((g) => ({ grammarId: g.grammarId, attempts: g.attempts, accuracy: g.recent.filter(Boolean).length / g.recent.length }))
    .filter((g) => g.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function totalLearningSeconds(state: LearnerState): number {
  return Object.values(state.activity).reduce((sum, d) => sum + d.seconds, 0);
}

export function overallAccuracy(state: LearnerState): number | null {
  let correct = 0;
  let total = 0;
  for (const d of Object.values(state.activity)) {
    correct += d.correct;
    total += d.correct + d.incorrect;
  }
  return total === 0 ? null : correct / total;
}

export function reviewAccuracy(state: LearnerState): number | null {
  const { reviewCorrect, reviewCardsCompleted } = state.counters;
  return reviewCardsCompleted === 0 ? null : reviewCorrect / reviewCardsCompleted;
}
