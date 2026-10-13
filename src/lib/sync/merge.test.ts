import { describe, expect, it } from "vitest";
import { createInitialState } from "@/lib/state/initial";
import type { LearnerState, WordProgress } from "@/lib/state/types";
import { mergeStates, statesEqual } from "./merge";

const DAY = 86_400_000;

function word(vocabId: string, patch: Partial<WordProgress> = {}): WordProgress {
  return {
    vocabId,
    introducedInLesson: "u1-l1",
    createdAt: 1000,
    timesSeen: 1,
    timesCorrect: 1,
    timesIncorrect: 0,
    strength: 0.5,
    masteryScore: 50,
    lastReviewed: 1000,
    lastIncorrectAt: null,
    nextReview: 2000,
    intervalDays: 1,
    ease: 2.5,
    repetitions: 1,
    lapses: 0,
    ...patch,
  };
}

function state(patch: Partial<LearnerState> = {}): LearnerState {
  return { ...createInitialState(), ...patch };
}

function day(date: string, xp: number) {
  return { date, xp, seconds: 60, lessons: 1, reviews: 0, newWords: 0, correct: 1, incorrect: 0 };
}

describe("mergeStates", () => {
  it("keeps progress made on either device", () => {
    const phone = state({ updatedAt: 10, words: { a: word("a") }, totalXp: 20, activity: { "2026-01-01": day("2026-01-01", 20) } });
    const desktop = state({ updatedAt: 20, words: { b: word("b") }, totalXp: 30, activity: { "2026-01-02": day("2026-01-02", 30) } });

    const merged = mergeStates(phone, desktop);

    expect(Object.keys(merged.words).sort()).toEqual(["a", "b"]);
    expect(Object.keys(merged.activity).sort()).toEqual(["2026-01-01", "2026-01-02"]);
    expect(merged.totalXp).toBe(50);
  });

  it("takes the more recently reviewed copy of a word", () => {
    const old = state({ updatedAt: 50, words: { a: word("a", { lastReviewed: 1000, strength: 0.2 }) } });
    const fresh = state({ updatedAt: 10, words: { a: word("a", { lastReviewed: 5000, strength: 0.9 }) } });

    // Independent of which device has the newer overall timestamp, or which side is "local".
    expect(mergeStates(old, fresh).words.a.strength).toBe(0.9);
    expect(mergeStates(fresh, old).words.a.strength).toBe(0.9);
  });

  it("is the same whichever side is local", () => {
    const a = state({
      updatedAt: 10,
      words: { x: word("x", { lastReviewed: 7 }) },
      lessons: { l1: { lessonId: "l1", firstCompletedAt: 5, lastCompletedAt: 9, timesCompleted: 2, bestAccuracy: 0.8, lastAccuracy: 0.8 } },
      counters: { ...createInitialState().counters, perfectLessons: 2 },
    });
    const b = state({
      updatedAt: 20,
      words: { y: word("y") },
      lessons: { l1: { lessonId: "l1", firstCompletedAt: 3, lastCompletedAt: 12, timesCompleted: 1, bestAccuracy: 1, lastAccuracy: 1 } },
      counters: { ...createInitialState().counters, perfectLessons: 1, dailyGoalsHit: 3 },
    });
    expect(statesEqual(mergeStates(a, b), mergeStates(b, a))).toBe(true);
  });

  it("merging twice changes nothing", () => {
    const a = state({ updatedAt: 10, words: { a: word("a") } });
    const b = state({ updatedAt: 20, words: { b: word("b") }, totalXp: 5, activity: { "2026-01-01": day("2026-01-01", 5) } });
    const once = mergeStates(a, b);
    expect(statesEqual(mergeStates(once, b), once)).toBe(true);
    expect(statesEqual(mergeStates(once, a), once)).toBe(true);
  });

  it("merges lessons without losing the first completion or the best score", () => {
    const x = state({ lessons: { l: { lessonId: "l", firstCompletedAt: 100, lastCompletedAt: 100, timesCompleted: 1, bestAccuracy: 1, lastAccuracy: 1 } } });
    const y = state({ lessons: { l: { lessonId: "l", firstCompletedAt: 300, lastCompletedAt: 300, timesCompleted: 1, bestAccuracy: 0.7, lastAccuracy: 0.7 } } });
    const lesson = mergeStates(x, y).lessons.l;
    expect(lesson.firstCompletedAt).toBe(100);
    expect(lesson.bestAccuracy).toBe(1);
    expect(lesson.lastAccuracy).toBe(0.7);
  });

  it("a lesson is only 'placed out' if neither device played it", () => {
    const placed = { lessonId: "l", firstCompletedAt: 1, lastCompletedAt: 1, timesCompleted: 0, bestAccuracy: 0, lastAccuracy: 0, placedOut: true };
    const played = { ...placed, firstCompletedAt: 5, lastCompletedAt: 5, timesCompleted: 1, bestAccuracy: 0.9, lastAccuracy: 0.9, placedOut: undefined };
    expect(mergeStates(state({ lessons: { l: placed } }), state({ lessons: { l: played } })).lessons.l.placedOut).toBeUndefined();
    expect(mergeStates(state({ lessons: { l: placed } }), state({ lessons: { l: placed } })).lessons.l.placedOut).toBe(true);
  });

  it("unions achievements, keeping the earliest unlock", () => {
    const a = state({ achievements: { first: { unlockedAt: 50 }, streak3: { unlockedAt: 90 } } });
    const b = state({ achievements: { first: { unlockedAt: 20 } } });
    expect(mergeStates(a, b).achievements).toEqual({ first: { unlockedAt: 20 }, streak3: { unlockedAt: 90 } });
  });

  it("does not send an onboarded learner back through onboarding", () => {
    const onboarded = state({ updatedAt: 10, profile: { ...createInitialState().profile, displayName: "Ana", onboardedAt: 5 } });
    // A fresh device that has since been touched (e.g. a theme change) is the newer copy.
    const fresh = state({ updatedAt: 99 });
    const merged = mergeStates(fresh, onboarded);
    expect(merged.profile.displayName).toBe("Ana");
    expect(merged.profile.onboardedAt).toBe(5);
  });

  it("uses the newer device's settings", () => {
    const a = state({ updatedAt: 10, settings: { ...createInitialState().settings, theme: "light" } });
    const b = state({ updatedAt: 20, settings: { ...createInitialState().settings, theme: "dark" } });
    expect(mergeStates(a, b).settings.theme).toBe("dark");
  });

  it("keeps a profile edit even when the other device was used more recently for something else", () => {
    // Desktop renamed the learner; the phone, never synced since, then did a lesson (so its copy is "newer").
    const desktop = state({ updatedAt: 100, profileEditedAt: 100, profile: { ...createInitialState().profile, displayName: "Ana", onboardedAt: 5 } });
    const phone = state({ updatedAt: 500, profile: { ...createInitialState().profile, displayName: "", onboardedAt: 5 } });
    expect(mergeStates(phone, desktop).profile.displayName).toBe("Ana");
    expect(mergeStates(desktop, phone).profile.displayName).toBe("Ana");
  });

  it("keeps a settings edit the same way", () => {
    const desktop = state({ updatedAt: 100, settingsEditedAt: 100, settings: { ...createInitialState().settings, theme: "light" } });
    const phone = state({ updatedAt: 500 });
    expect(mergeStates(phone, desktop).settings.theme).toBe("light");
  });

  it("a later profile edit wins over an earlier one", () => {
    const early = state({ updatedAt: 900, profileEditedAt: 100, profile: { ...createInitialState().profile, displayName: "Ana", onboardedAt: 5 } });
    const late = state({ updatedAt: 200, profileEditedAt: 200, profile: { ...createInitialState().profile, displayName: "Anita", onboardedAt: 5 } });
    expect(mergeStates(early, late).profile.displayName).toBe("Anita");
  });

  it("does not double-count XP when both devices saw the same days", () => {
    const shared = { "2026-01-01": day("2026-01-01", 40) };
    const a = state({ totalXp: 40, activity: shared });
    const b = state({ totalXp: 40, activity: shared });
    expect(mergeStates(a, b).totalXp).toBe(40);
  });

  it("lets a reset on one device win over old progress on another", () => {
    const old = state({ epoch: 0, updatedAt: 100, words: { a: word("a") }, totalXp: 99 });
    const reset = state({ epoch: 5 * DAY, updatedAt: 5 * DAY });
    const merged = mergeStates(old, reset);
    expect(merged).toBe(reset);
    expect(mergeStates(reset, old)).toBe(reset);
  });

  it("can fold signed-out progress into an account that was reset", () => {
    const guest = state({ epoch: 0, updatedAt: 100, words: { a: word("a") } });
    const account = state({ epoch: 5 * DAY, updatedAt: 200 });
    const merged = mergeStates(guest, account, { ignoreEpoch: true });
    expect(Object.keys(merged.words)).toEqual(["a"]);
    expect(merged.epoch).toBe(5 * DAY);
  });
});

describe("statesEqual", () => {
  it("ignores key order (Postgres jsonb reorders keys)", () => {
    const a = state();
    const reordered = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(a).reverse()))) as LearnerState;
    expect(statesEqual(a, reordered)).toBe(true);
  });

  it("notices a real difference", () => {
    expect(statesEqual(state(), state({ totalXp: 1 }))).toBe(false);
  });
});
