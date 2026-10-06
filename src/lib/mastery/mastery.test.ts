import { describe, expect, it } from "vitest";
import { applyAnswer, applyIntroduction, createWordProgress, encounterCap, masteryAt, masteryBand, nextStrength, retention } from "./mastery";
import { DAY } from "@/lib/util/dates";

const T0 = 1_700_000_000_000;

describe("nextStrength", () => {
  it("grows with correct answers, more for production than recognition", () => {
    const recognise = nextStrength(0.2, true, "multipleChoice", 1);
    const produce = nextStrength(0.2, true, "translation", 1);
    expect(recognise).toBeGreaterThan(0.2);
    expect(produce).toBeGreaterThan(recognise);
  });
  it("grows slower for harder words", () => {
    expect(nextStrength(0.2, true, "translation", 5)).toBeLessThan(nextStrength(0.2, true, "translation", 1));
  });
  it("drops on a miss and never goes negative", () => {
    expect(nextStrength(0.8, false, "translation", 1)).toBeLessThan(0.8);
    expect(nextStrength(0.01, false, "translation", 1)).toBe(0);
  });
});

describe("masteryAt", () => {
  it("caps mastery for words with few encounters", () => {
    expect(encounterCap(1)).toBeLessThan(0.6);
    const w = { strength: 1, timesSeen: 1, lastReviewed: T0, createdAt: T0, intervalDays: 1 };
    expect(masteryAt(w, T0)).toBeLessThanOrEqual(52);
  });
  it("decays when a review is overdue", () => {
    const w = { strength: 0.9, timesSeen: 12, lastReviewed: T0, createdAt: T0, intervalDays: 3 };
    expect(masteryAt(w, T0)).toBeGreaterThan(masteryAt(w, T0 + 10 * DAY));
  });
  it("hits the target retention at the due date", () => {
    expect(retention(3, 3)).toBeCloseTo(0.9, 5);
  });
  it("bands scores", () => {
    expect(masteryBand(20)).toBe("weak");
    expect(masteryBand(60)).toBe("learning");
    expect(masteryBand(85)).toBe("strong");
  });
});

describe("applyAnswer", () => {
  it("tracks counters and reaches 'strong' with repeated production", () => {
    let w = createWordProgress("hola", "lesson-1", T0);
    w = applyIntroduction(w, T0);
    for (let i = 0; i < 6; i++) w = applyAnswer(w, { correct: true, recall: "translation", difficulty: 1 }, T0);
    expect(w.timesCorrect).toBe(6);
    expect(w.timesSeen).toBe(7);
    expect(masteryBand(masteryAt(w, T0))).toBe("strong");
  });
  it("records the miss time", () => {
    const w = applyAnswer(createWordProgress("x", "l", T0), { correct: false, recall: "multipleChoice", difficulty: 2 }, T0 + 5);
    expect(w.lastIncorrectAt).toBe(T0 + 5);
    expect(w.timesIncorrect).toBe(1);
  });
});
