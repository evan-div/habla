import { describe, expect, it } from "vitest";
import { computeStreak } from "./streak";
import { levelForXp, levelInfo, xpToReachLevel } from "./levels";
import { computeSessionXp } from "./xp";
import { achievementStatuses } from "./achievements";
import type { AnswerRecord } from "@/lib/state/types";

describe("computeStreak", () => {
  it("counts consecutive days ending today", () => {
    const s = computeStreak(["2026-10-04", "2026-10-05", "2026-10-06"], "2026-10-06");
    expect(s).toMatchObject({ current: 3, longest: 3, activeToday: true });
  });
  it("stays alive until the end of today if yesterday was active", () => {
    const s = computeStreak(["2026-10-04", "2026-10-05"], "2026-10-06");
    expect(s.current).toBe(2);
    expect(s.needsPracticeToday).toBe(true);
  });
  it("forgives one missed day (rest day)", () => {
    expect(computeStreak(["2026-10-01", "2026-10-03", "2026-10-04"], "2026-10-04").current).toBe(3);
  });
  it("only allows one rest day per week", () => {
    const s = computeStreak(["2026-10-01", "2026-10-03", "2026-10-05"], "2026-10-05");
    expect(s.current).toBe(1);
    expect(s.longest).toBe(2);
  });
  it("lapses after a longer gap", () => {
    expect(computeStreak(["2026-10-01", "2026-10-02"], "2026-10-06").current).toBe(0);
  });
  it("handles no activity", () => {
    expect(computeStreak([], "2026-10-06").current).toBe(0);
  });
});

describe("levels", () => {
  it("maps XP to levels and back", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(79)).toBe(1);
    expect(levelForXp(80)).toBe(2);
    expect(levelForXp(xpToReachLevel(10))).toBe(10);
    expect(levelInfo(xpToReachLevel(10)).title).toBe("Conversational");
    expect(levelInfo(xpToReachLevel(5)).title).toBe("Explorer");
  });
});

describe("computeSessionXp", () => {
  const ans = (correct: boolean, retry = false): AnswerRecord => ({
    exerciseId: "x", type: "multipleChoice", vocabIds: [], grammarIds: [], correct, recall: "multipleChoice", retry,
  });
  it("pays for correct answers, streaks, completion and perfection", () => {
    const answers = Array.from({ length: 10 }, () => ans(true));
    const xp = computeSessionXp(answers, "lesson", false);
    // 10×2 + 2 streak bonuses of 3 + 25 + 15
    expect(xp.total).toBe(20 + 6 + 25 + 15);
    expect(xp.accuracy).toBe(1);
  });
  it("ignores retries for XP and accuracy", () => {
    const xp = computeSessionXp([ans(false), ans(true, true)], "lesson", false);
    expect(xp.correctCount).toBe(0);
    expect(xp.accuracy).toBe(0);
  });
  it("halves completion XP for repeats", () => {
    const first = computeSessionXp([ans(true)], "lesson", false).total;
    const repeat = computeSessionXp([ans(true)], "lesson", true).total;
    expect(repeat).toBeLessThan(first);
  });
});

describe("achievements", () => {
  it("clamps progress at target", () => {
    const stats = { lessonsCompleted: 3, perfectLessons: 0, wordsLearned: 30, wordsMastered: 0, verbsLearned: 0, grammarLearned: 0, currentStreak: 0, longestStreak: 0, reviewCardsCompleted: 0, unitsCompleted: [], realTalkLessons: 0, dailyGoalsHit: 0, level: 1 };
    const statuses = achievementStatuses(stats);
    expect(statuses.find((s) => s.def.id === "first-lesson")?.unlocked).toBe(true);
    expect(statuses.find((s) => s.def.id === "words-25")?.unlocked).toBe(true);
    expect(statuses.find((s) => s.def.id === "words-100")?.progress).toBe(30);
  });
});
