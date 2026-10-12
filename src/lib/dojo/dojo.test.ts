import { describe, expect, it } from "vitest";
import { XP_RULES } from "@/config/xp";
import { conjugate, TENSES } from "@/lib/conjugate/conjugate";
import { applyPlacement } from "@/lib/placement";
import { createInitialState } from "@/lib/state/initial";
import { streakOf } from "@/lib/state/selectors";
import type { LearnerState } from "@/lib/state/types";
import { DAY } from "@/lib/util/dates";
import { BELT_TEST, BELTS, beltUnit, getDojoVerb, TENSE_INFO, unitTeaching } from "./catalog";
import { checkConjugation } from "./check";
import { applyDojoSession, type DojoPayload } from "./commit";
import { buildQueue } from "./prompts";
import { beltPool, beltStatuses, practicePool, unlockedTenses, weakSpots } from "./selectors";
import { beltPassed, comboMultiplier, currentDojoItem, dojoSessionReducer, initDojoSession, type DojoAnswer, type DojoSessionState } from "./session";

const T0 = new Date(2026, 9, 6, 10, 0).getTime();

/** A learner placed at the start of `unit` (everything before it counts as learned). */
function learnerAt(unit: number): LearnerState {
  const s = createInitialState("test");
  return applyPlacement({ ...s, profile: { ...s.profile, onboardedAt: T0, dailyGoalXp: 50 } }, unit, { correct: 0, answered: 0 }, T0);
}

/** The answer a perfect learner types for the current prompt. */
function rightAnswer(state: DojoSessionState): string {
  const { prompt } = currentDojoItem(state)!;
  return conjugate(getDojoVerb(prompt.verbId)!.spec, prompt.tense)[prompt.person];
}

function answer(state: DojoSessionState, correct: boolean): DojoSessionState {
  let s = dojoSessionReducer(state, { type: "input", value: correct ? rightAnswer(state) : "zzz" });
  s = dojoSessionReducer(s, { type: "check" });
  return dojoSessionReducer(s, { type: "continue" });
}

describe("catalog", () => {
  it("every tense opens with a grammar lesson the course actually teaches", () => {
    for (const t of TENSES) expect(unitTeaching(TENSE_INFO[t].grammarId), t).toBeDefined();
  });

  it("belts unlock in course order", () => {
    const units = BELTS.map((b) => beltUnit(b)!);
    expect(units.every((u) => u !== undefined)).toBe(true);
    expect([...units].sort((a, b) => a - b)).toEqual(units);
  });

  it("the white belt is ready as soon as the Dojo opens", () => {
    const unit = unitTeaching(TENSE_INFO.present.grammarId)!;
    const state = learnerAt(unit + 1);
    expect(unlockedTenses(state)).toEqual(["present"]);
    expect(beltStatuses(state)[0]).toMatchObject({ state: "next", ready: true });
  });

  it("a graduate can reach every belt", () => {
    const state = learnerAt(30);
    expect(unlockedTenses(state)).toEqual([...TENSES]);
    for (const belt of BELTS) expect(beltPool(state, belt).verbIds.length, belt.id).toBeGreaterThanOrEqual(4);
  });
});

describe("checking answers", () => {
  const hablar = { infinitive: "hablar" };

  it("accepts the form, with or without a subject pronoun", () => {
    expect(checkConjugation(hablar, "preterite", "el", "habló").correct).toBe(true);
    expect(checkConjugation(hablar, "preterite", "el", "  Él habló ").correct).toBe(true);
    expect(checkConjugation({ infinitive: "levantarse" }, "presentProgressive", "yo", "estoy levantándome").correct).toBe(true);
  });

  it("is strict about accents, and says when the answer is another real form", () => {
    expect(checkConjugation(hablar, "preterite", "el", "hablo")).toMatchObject({ correct: false, reason: "other-form", otherForm: { tense: "present", persons: ["yo"] } });
    expect(checkConjugation(hablar, "present", "tu", "habla")).toMatchObject({ correct: false, reason: "other-form", otherForm: { tense: "present", persons: ["el"] } });
    expect(checkConjugation(hablar, "imperfect", "tu", "hablaba")).toMatchObject({ reason: "other-form", otherForm: { tense: "imperfect", persons: ["yo", "el"] } });
    expect(checkConjugation(hablar, "imperfect", "nosotros", "hablabamos")).toMatchObject({ correct: false, reason: "accent" });
    expect(checkConjugation(hablar, "present", "yo", "hablé ola")).toMatchObject({ correct: false, reason: "wrong", answer: "hablo" });
    expect(checkConjugation(hablar, "present", "yo", " ")).toMatchObject({ correct: false, reason: "blank" });
  });
});

describe("sessions", () => {
  const state = learnerAt(15);
  const pool = practicePool(state, [], "all");

  it("training brings a missed prompt back once at the end", () => {
    let s = initDojoSession({ mode: "train", prompts: buildQueue(pool, {}, "all", 3, 1) });
    const missed = currentDojoItem(s)!.prompt;
    s = answer(s, false);
    s = answer(s, true);
    s = answer(s, true);
    expect(s.phase).toBe("answering");
    expect(currentDojoItem(s)).toMatchObject({ prompt: missed, retry: true });
    s = answer(s, true);
    expect(s.phase).toBe("done");
    expect(s.answers.filter((a) => !a.retry)).toHaveLength(3);
  });

  it("a belt test ends at the third miss", () => {
    let s = initDojoSession({ mode: "belt", prompts: buildQueue(pool, {}, "all", BELT_TEST.length, 2), lives: BELT_TEST.lives });
    for (let i = 0; i < 3; i++) s = answer(s, false);
    expect(s.phase).toBe("done");
    expect(beltPassed(s)).toBe(false);
  });

  it("a belt test is passed with a life to spare", () => {
    let s = initDojoSession({ mode: "belt", prompts: buildQueue(pool, {}, "all", BELT_TEST.length, 3), lives: BELT_TEST.lives });
    for (let i = 0; i < BELT_TEST.length; i++) s = answer(s, i >= 2);
    expect(s.phase).toBe("done");
    expect(s.lives).toBe(1);
    expect(beltPassed(s)).toBe(true);
  });

  it("sparring keeps drawing prompts and multiplies points on a combo", () => {
    let s = initDojoSession({ mode: "spar", pool, stats: {}, focus: "all", seed: 4 });
    expect(s.phase).toBe("ready");
    s = dojoSessionReducer(s, { type: "start" });
    for (let i = 0; i < 6; i++) s = answer(s, true);
    expect(s.combo).toBe(6);
    expect(s.score).toBe(10 * 4 + 20 * 2);
    s = answer(s, false);
    expect(s.combo).toBe(0);
    expect(s.bestCombo).toBe(6);
    s = dojoSessionReducer(s, { type: "timeUp" });
    expect(s.phase).toBe("done");
    expect([comboMultiplier(4), comboMultiplier(5), comboMultiplier(10), comboMultiplier(20)]).toEqual([1, 2, 3, 4]);
  });
});

describe("committing a session", () => {
  const verbId = "hablar";
  const answers = (n: number, correct: boolean): DojoAnswer[] => Array.from({ length: n }, () => ({ verbId, tense: "present" as const, person: "yo" as const, correct, retry: false }));
  const payload = (over: Partial<DojoPayload>): DojoPayload => ({ mode: "train", answers: [], durationSeconds: 60, score: 0, bestCombo: 0, ...over });

  it("pays XP per correct answer up to a daily cap", () => {
    const cap = XP_RULES.dojo.dailyCap;
    const first = applyDojoSession(learnerAt(5), payload({ answers: answers(cap - 10, true) }), T0);
    expect(first.summary.xpTotal).toBe(cap - 10);
    const second = applyDojoSession(first.state, payload({ answers: answers(20, true) }), T0 + 60_000);
    expect(second.summary.xpTotal).toBe(10);
    expect(second.summary.xpCapped).toBe(true);
    const tomorrow = applyDojoSession(second.state, payload({ answers: answers(5, true) }), T0 + DAY);
    expect(tomorrow.summary.xpTotal).toBe(5);
  });

  it("counts toward the streak and records per-verb results", () => {
    const { state } = applyDojoSession(learnerAt(5), payload({ answers: [...answers(3, true), ...answers(2, false)] }), T0 + DAY);
    expect(streakOf(state, T0 + DAY).activeToday).toBe(true);
    expect(state.dojo.stats["hablar:present"]).toMatchObject({ attempts: 5, correct: 3 });
  });

  it("awards a belt once, with its bonus", () => {
    const base = learnerAt(5);
    const won = applyDojoSession(base, payload({ mode: "belt", beltId: "white", passed: true, answers: answers(20, true) }), T0);
    expect(won.summary.beltEarned).toBe(true);
    expect(won.state.dojo.belts.white).toBeDefined();
    expect(won.summary.xpLines.map((l) => l.label)).toContain("White belt");
    expect(won.state.achievements["first-belt"]).toBeDefined();
    const again = applyDojoSession(won.state, payload({ mode: "belt", beltId: "white", passed: true, answers: answers(20, true) }), T0 + DAY);
    expect(again.summary.beltEarned).toBe(false);
  });

  it("keeps the best sparring score", () => {
    const one = applyDojoSession(learnerAt(5), payload({ mode: "spar", score: 120, bestCombo: 7, answers: answers(10, true) }), T0);
    expect(one.summary.newHighScore).toBe(true);
    const two = applyDojoSession(one.state, payload({ mode: "spar", score: 80, bestCombo: 3, answers: answers(8, true) }), T0 + 1000);
    expect(two.summary.newHighScore).toBe(false);
    expect(two.state.dojo).toMatchObject({ bestSparScore: 120, bestCombo: 7 });
    const training = applyDojoSession(two.state, payload({ mode: "train", bestCombo: 15, answers: answers(15, true) }), T0 + 2000);
    expect(training.state.dojo.bestCombo).toBe(7);
  });

  it("surfaces the verb + tense pairs missed most", () => {
    const { state } = applyDojoSession(learnerAt(5), payload({ answers: [...answers(1, true), ...answers(3, false)] }), T0);
    expect(weakSpots(state)).toMatchObject([{ verb: { id: "hablar" }, tense: "present", attempts: 4 }]);
  });
});
