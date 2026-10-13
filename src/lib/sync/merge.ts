import { STATE_VERSION } from "@/lib/state/initial";
import type { DailyActivity, GrammarProgress, LearnerState, LessonProgress, WordProgress } from "@/lib/state/types";

/**
 * Two devices can each practice while apart. Rather than let the last writer
 * clobber the other, merge record by record: whichever side has seen a word,
 * lesson or day more recently keeps it, and nothing is dropped.
 */

export interface MergeOptions {
  /**
   * Treat the two states as the same lineage even if their epochs differ. Used when a
   * signed-out device's progress is adopted into an account, so it is never silently thrown away.
   */
  ignoreEpoch?: boolean;
}

export function mergeStates(a: LearnerState, b: LearnerState, options: MergeOptions = {}): LearnerState {
  // A deliberate reset/import replaces everything older than it.
  if (!options.ignoreEpoch && a.epoch !== b.epoch) return a.epoch > b.epoch ? a : b;

  const newer = a.updatedAt >= b.updatedAt ? a : b;

  const words = mergeRecords(a.words, b.words, newerWord);
  const grammar = mergeRecords(a.grammar, b.grammar, newerGrammar);
  const lessons = mergeRecords(a.lessons, b.lessons, mergeLesson);
  const activity = mergeRecords(a.activity, b.activity, busierDay);

  const merged: LearnerState = {
    ...newer,
    version: STATE_VERSION,
    epoch: Math.max(a.epoch, b.epoch),
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
    profile: mergeProfile(a, b, newer),
    profileEditedAt: Math.max(a.profileEditedAt, b.profileEditedAt),
    settings: lastEdited(a, b, "settingsEditedAt", newer).settings,
    settingsEditedAt: Math.max(a.settingsEditedAt, b.settingsEditedAt),
    words,
    grammar,
    lessons,
    activity,
    achievements: mergeRecords(a.achievements, b.achievements, (x, y) => (x.unlockedAt <= y.unlockedAt ? x : y)),
    counters: maxCounters(a.counters, b.counters),
    placement: laterPlacement(a.placement, b.placement) ?? newer.placement,
    totalXp: mergeTotalXp(a, b, activity),
  };
  return merged;
}

/** Whichever side edited this section most recently; if neither (or both equally), whichever side was touched last. */
function lastEdited(a: LearnerState, b: LearnerState, field: "profileEditedAt" | "settingsEditedAt", newer: LearnerState): LearnerState {
  if (a[field] === b[field]) return newer;
  return a[field] > b[field] ? a : b;
}

function mergeProfile(a: LearnerState, b: LearnerState, newer: LearnerState): LearnerState["profile"] {
  const chosen = lastEdited(a, b, "profileEditedAt", newer);
  const other = chosen === a ? b : a;
  // Someone who has finished onboarding on one device shouldn't be sent back through it by a fresh one.
  return chosen.profile.onboardedAt === null && other.profile.onboardedAt !== null ? other.profile : chosen.profile;
}

/** Union of two keyed records; where both have a key, `pick` decides. */
function mergeRecords<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const [key, value] of Object.entries(b)) {
    out[key] = key in a ? pick(a[key], value) : value;
  }
  return out;
}

function newerWord(x: WordProgress, y: WordProgress): WordProgress {
  const xAt = x.lastReviewed ?? 0;
  const yAt = y.lastReviewed ?? 0;
  if (xAt !== yAt) return xAt > yAt ? x : y;
  return y.timesSeen > x.timesSeen ? y : x;
}

function newerGrammar(x: GrammarProgress, y: GrammarProgress): GrammarProgress {
  const xAt = x.lastPracticed ?? x.learnedAt;
  const yAt = y.lastPracticed ?? y.learnedAt;
  if (xAt !== yAt) return xAt > yAt ? x : y;
  return y.attempts > x.attempts ? y : x;
}

function mergeLesson(x: LessonProgress, y: LessonProgress): LessonProgress {
  const latest = y.lastCompletedAt > x.lastCompletedAt ? y : x;
  const played = !x.placedOut || !y.placedOut;
  return {
    ...latest,
    firstCompletedAt: Math.min(x.firstCompletedAt, y.firstCompletedAt),
    bestAccuracy: Math.max(x.bestAccuracy, y.bestAccuracy),
    timesCompleted: Math.max(x.timesCompleted, y.timesCompleted),
    // "Skipped by placement" only holds if neither device actually played the lesson.
    placedOut: played ? undefined : true,
  };
}

function busierDay(x: DailyActivity, y: DailyActivity): DailyActivity {
  if (x.xp !== y.xp) return x.xp > y.xp ? x : y;
  return y.lessons + y.reviews > x.lessons + x.reviews ? y : x;
}

function maxCounters(x: LearnerState["counters"], y: LearnerState["counters"]): LearnerState["counters"] {
  const out = { ...x };
  for (const key of Object.keys(y) as Array<keyof typeof out>) out[key] = Math.max(x[key], y[key]);
  return out;
}

function laterPlacement(x: LearnerState["placement"], y: LearnerState["placement"]): LearnerState["placement"] {
  if (!x || !y) return x ?? y;
  return y.completedAt > x.completedAt ? y : x;
}

const xpOnRecord = (activity: Record<string, DailyActivity>) => Object.values(activity).reduce((sum, d) => sum + d.xp, 0);

/**
 * Total XP is the larger of the two totals, plus whatever XP the merged days hold
 * that neither side counted alone (practice done on different days on each device).
 */
function mergeTotalXp(a: LearnerState, b: LearnerState, mergedActivity: Record<string, DailyActivity>): number {
  const base = Math.max(a.totalXp, b.totalXp);
  const extra = xpOnRecord(mergedActivity) - Math.max(xpOnRecord(a.activity), xpOnRecord(b.activity));
  return base + Math.max(0, extra);
}

/** Key-order-independent JSON, so a state that round-tripped through Postgres jsonb compares equal. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([k1], [k2]) => (k1 < k2 ? -1 : k1 > k2 ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function statesEqual(a: LearnerState, b: LearnerState): boolean {
  return stableStringify(a) === stableStringify(b);
}
