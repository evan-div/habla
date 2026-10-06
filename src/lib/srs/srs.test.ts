import { describe, expect, it } from "vitest";
import { schedule, sessionQuality } from "./scheduler";
import { selectPracticeQueue, selectReviewQueue } from "./queue";
import { applyAnswer, createWordProgress } from "@/lib/mastery/mastery";
import { DAY, MINUTE } from "@/lib/util/dates";

const T0 = 1_700_000_000_000;
const base = { nextReview: T0, intervalDays: 1, ease: 2.5, repetitions: 0, lapses: 0 };

describe("sessionQuality", () => {
  it("grades by how the session ended", () => {
    expect(sessionQuality([{ correct: true, recall: "translation" }])).toBe(5);
    expect(sessionQuality([{ correct: true, recall: "multipleChoice" }])).toBe(4);
    expect(sessionQuality([{ correct: false, recall: "multipleChoice" }, { correct: true, recall: "multipleChoice" }])).toBe(3);
    expect(sessionQuality([{ correct: true, recall: "multipleChoice" }, { correct: false, recall: "multipleChoice" }])).toBe(1);
  });
});

describe("schedule", () => {
  it("walks 1 → 3 → ease-multiplied days on repeated success", () => {
    const a = schedule(base, 4, T0, true);
    expect(a.intervalDays).toBe(1);
    const b = schedule({ ...a }, 4, T0, true);
    expect(b.intervalDays).toBe(3);
    const c = schedule({ ...b }, 4, T0, true);
    expect(c.intervalDays).toBeGreaterThanOrEqual(7);
    expect(c.nextReview).toBe(T0 + c.intervalDays * DAY);
  });
  it("brings a missed word back in minutes and resets progress", () => {
    const s = schedule({ ...base, repetitions: 4, intervalDays: 20 }, 1, T0, true);
    expect(s.repetitions).toBe(0);
    expect(s.lapses).toBe(1);
    expect(s.nextReview).toBe(T0 + 10 * MINUTE);
    expect(s.ease).toBeLessThan(2.5);
  });
  it("does not advance the schedule when practicing early", () => {
    const early = { ...base, repetitions: 2, intervalDays: 3, nextReview: T0 + 2 * DAY };
    expect(schedule(early, 5, T0, false)).toEqual(early);
  });
});

describe("queues", () => {
  const mk = (id: string, patch: Partial<ReturnType<typeof createWordProgress>>) => ({ ...createWordProgress(id, "l", T0), ...patch });
  it("only reviews due words, weakest and most-missed first", () => {
    const weakMissed = applyAnswer(mk("weak", { nextReview: T0 - DAY }), { correct: false, recall: "translation", difficulty: 2 }, T0 - 1000);
    const strong = mk("strong", { nextReview: T0 - DAY, strength: 0.95, timesSeen: 12, lastReviewed: T0 - DAY });
    const notDue = mk("later", { nextReview: T0 + 5 * DAY });
    const queue = selectReviewQueue([strong, notDue, { ...weakMissed, nextReview: T0 - DAY }], T0).map((w) => w.vocabId);
    expect(queue).toEqual(["weak", "strong"]);
  });
  it("falls back to the weakest words for practice", () => {
    const words = [mk("a", { strength: 0.9, timesSeen: 9 }), mk("b", { strength: 0.1 })];
    expect(selectPracticeQueue(words, T0)[0].vocabId).toBe("b");
  });
});
