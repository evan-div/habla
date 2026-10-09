import { describe, expect, it } from "vitest";
import { PLACEMENT } from "@/content/placement";
import { ALL_LESSONS, ALL_UNITS } from "@/content/course";
import { evaluate } from "@/lib/engine/evaluate";
import { perfectResponse } from "@/lib/engine/test-utils";
import { createInitialState } from "@/lib/state/initial";
import { dueWords } from "@/lib/srs/queue";
import { achievementsOf, lessonStatus, lessonsCompletedCount, nextLesson, unitProgress } from "@/lib/state/selectors";
import { applyPlacement, recommendedStart, skipSummary } from "./placement";
import { DAY } from "@/lib/util/dates";

const T0 = new Date(2026, 9, 6, 10).getTime();
const playableUnits = ALL_UNITS.filter((u) => !u.comingSoon);

describe("placement content", () => {
  it("has one level per playable unit, two answerable questions each", () => {
    expect(PLACEMENT.map((p) => p.unitNumber)).toEqual(playableUnits.map((u) => u.number));
    for (const level of PLACEMENT) {
      expect(level.exercises).toHaveLength(2);
      for (const ex of level.exercises) {
        expect(evaluate(ex, perfectResponse(ex)!).correct).toBe(true);
        if ("options" in ex && ex.options) expect(new Set(ex.options).size).toBe(ex.options.length);
      }
    }
  });
});

describe("recommendedStart", () => {
  const out = (...passed: boolean[]) => passed.map((p, i) => ({ unitNumber: i + 1, passed: p }));
  it("starts at the first level not passed", () => {
    expect(recommendedStart(out(true, true, false), 7)).toBe(3);
    expect(recommendedStart(out(false), 7)).toBe(1);
  });
  it("starts at the newest unit when everything is passed", () => {
    expect(recommendedStart(out(true, true, true, true, true, true, true), 7)).toBe(7);
  });
});

describe("applyPlacement", () => {
  const base = createInitialState("t");
  const placed = applyPlacement(base, 4, { correct: 6, answered: 7 }, T0);

  it("marks earlier lessons placed out and unlocks the start unit", () => {
    const earlier = ALL_LESSONS.filter((l) => playableUnits.find((u) => u.id === l.unitId)!.number < 4);
    expect(earlier.length).toBeGreaterThan(10);
    for (const l of earlier) expect(placed.lessons[l.id]?.placedOut).toBe(true);
    expect(nextLesson(placed)?.unit.number).toBe(4);
    expect(lessonStatus(placed, nextLesson(placed)!.lesson.id)).toBe("available");
    expect(placed.placement).toMatchObject({ startUnitNumber: 4, correct: 6 });
  });

  it("adds skipped words at moderate mastery, trickling into review over days", () => {
    const words = Object.values(placed.words);
    expect(words.length).toBe(skipSummary(4).wordCount);
    for (const w of words) {
      expect(w.masteryScore).toBeGreaterThan(20);
      expect(w.masteryScore).toBeLessThan(60);
    }
    expect(dueWords(words, T0)).toHaveLength(0);
    const day2 = dueWords(words, T0 + 2 * DAY).length;
    const day8 = dueWords(words, T0 + 8 * DAY).length;
    expect(day2).toBeGreaterThan(0);
    expect(day2).toBeLessThan(day8);
  });

  it("doesn't count skipped lessons or units as achievements, but counts progress", () => {
    expect(lessonsCompletedCount(placed)).toBe(0);
    expect(unitProgress(placed, playableUnits[0]).done).toBe(true);
    expect(achievementsOf(placed, T0).find((a) => a.def.id === "first-lesson")?.unlocked).toBe(false);
    expect(achievementsOf(placed, T0).find((a) => a.def.id === "first-unit")?.unlocked).toBe(false);
  });

  it("never overwrites lessons already played", () => {
    const played = { ...base, lessons: { [ALL_LESSONS[0].id]: { lessonId: ALL_LESSONS[0].id, firstCompletedAt: 1, lastCompletedAt: 1, timesCompleted: 2, bestAccuracy: 1, lastAccuracy: 1 } } };
    const result = applyPlacement(played, 3, { correct: 4, answered: 5 }, T0);
    expect(result.lessons[ALL_LESSONS[0].id].timesCompleted).toBe(2);
    expect(result.lessons[ALL_LESSONS[0].id].placedOut).toBeUndefined();
  });

  it("starting at unit 1 changes nothing", () => {
    const same = applyPlacement(base, 1, { correct: 0, answered: 1 }, T0);
    expect(Object.keys(same.lessons)).toHaveLength(0);
    expect(Object.keys(same.words)).toHaveLength(0);
  });
});
