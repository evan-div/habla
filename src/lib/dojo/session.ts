import type { Person } from "@/content/types";
import type { Tense } from "@/lib/conjugate/conjugate";
import type { DojoFocus, DojoVerbStat } from "@/lib/state/types";
import { mulberry32 } from "@/lib/util/random";
import { getDojoVerb } from "./catalog";
import { checkConjugation, type DojoCheck } from "./check";
import { pickPrompt, type DojoPool, type DojoPrompt } from "./prompts";

export type DojoMode = "train" | "spar" | "belt";

export interface DojoAnswer {
  verbId: string;
  tense: Tense;
  person: Person;
  correct: boolean;
  /** Second go at a missed prompt in training; not scored. */
  retry: boolean;
  /** What the learner typed, and the form we wanted (for the mistakes list). */
  given?: string;
  expected?: string;
}

interface DojoItem {
  prompt: DojoPrompt;
  retry: boolean;
  key: string;
}

/** Sparring draws prompts as it goes, so it carries what it needs to keep drawing. */
interface Generator {
  pool: DojoPool;
  stats: Readonly<Record<string, DojoVerbStat>>;
  focus: DojoFocus;
  seed: number;
}

export interface DojoSessionState {
  mode: DojoMode;
  items: DojoItem[];
  index: number;
  /** "ready" only for sparring, which waits for the learner to start the clock. */
  phase: "ready" | "answering" | "feedback" | "done";
  input: string;
  result: DojoCheck | null;
  answers: DojoAnswer[];
  /** Belt tests only. */
  lives: number | null;
  combo: number;
  bestCombo: number;
  score: number;
  /** Points from the latest answer, for the +N flash. */
  lastPoints: number;
  generator: Generator | null;
}

export type DojoSessionAction =
  | { type: "start" }
  | { type: "input"; value: string }
  | { type: "check" }
  | { type: "skip" }
  | { type: "continue" }
  | { type: "timeUp" };

export const SPAR_SECONDS = 60;
const SPAR_POINTS = 10;

/** Combo multiplier: the 5th correct answer in a row doubles, the 10th triples, the 20th quadruples. */
export function comboMultiplier(combo: number): number {
  return combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
}

const item = (prompt: DojoPrompt, n: number, retry = false): DojoItem => ({ prompt, retry, key: `${n}:${prompt.verbId}:${prompt.tense}:${prompt.person}${retry ? ":retry" : ""}` });

function draw(gen: Generator, items: readonly DojoItem[]): DojoPrompt {
  const rand = mulberry32(gen.seed + items.length * 7919);
  return pickPrompt(gen.pool, gen.stats, gen.focus, rand, items.slice(-10).map((i) => i.prompt));
}

export function initDojoSession(
  config:
    | { mode: "train" | "belt"; prompts: DojoPrompt[]; lives?: number }
    | { mode: "spar"; pool: DojoPool; stats: Readonly<Record<string, DojoVerbStat>>; focus: DojoFocus; seed: number },
): DojoSessionState {
  const base = { index: 0, input: "", result: null, answers: [], combo: 0, bestCombo: 0, score: 0, lastPoints: 0 };
  if (config.mode === "spar") {
    const generator: Generator = { pool: config.pool, stats: config.stats, focus: config.focus, seed: config.seed };
    return { ...base, mode: "spar", phase: "ready", lives: null, generator, items: [item(draw(generator, []), 0)] };
  }
  return {
    ...base,
    mode: config.mode,
    phase: config.prompts.length > 0 ? "answering" : "done",
    lives: config.mode === "belt" ? (config.lives ?? 3) : null,
    generator: null,
    items: config.prompts.map((p, i) => item(p, i)),
  };
}

export function currentDojoItem(state: DojoSessionState): DojoItem | undefined {
  return state.items[state.index];
}

function grade(state: DojoSessionState, input: string): DojoSessionState {
  const current = currentDojoItem(state);
  if (state.phase !== "answering" || !current) return state;
  const verb = getDojoVerb(current.prompt.verbId);
  if (!verb) return state;
  const { tense, person } = current.prompt;
  const result = checkConjugation(verb.spec, tense, person, input);
  const combo = result.correct ? state.combo + 1 : 0;
  const lastPoints = result.correct && state.mode === "spar" ? SPAR_POINTS * comboMultiplier(combo) : 0;
  const items = state.mode === "train" && !result.correct && !current.retry ? [...state.items, item(current.prompt, state.items.length, true)] : state.items;
  return {
    ...state,
    phase: "feedback",
    input,
    result,
    items,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    score: state.score + lastPoints,
    lastPoints,
    lives: state.lives !== null && !result.correct ? state.lives - 1 : state.lives,
    answers: [...state.answers, { verbId: current.prompt.verbId, tense, person, correct: result.correct, retry: current.retry, given: input.trim(), expected: result.answer }],
  };
}

export function dojoSessionReducer(state: DojoSessionState, action: DojoSessionAction): DojoSessionState {
  switch (action.type) {
    case "start":
      return state.phase === "ready" ? { ...state, phase: "answering" } : state;
    case "input":
      return state.phase === "answering" ? { ...state, input: action.value } : state;
    case "check":
      return state.input.trim() ? grade(state, state.input) : state;
    case "skip":
      return grade(state, "");
    case "continue": {
      if (state.phase !== "feedback") return state;
      if (state.lives === 0) return { ...state, phase: "done" };
      const index = state.index + 1;
      let items = state.items;
      if (state.generator && index >= items.length) items = [...items, item(draw(state.generator, items), items.length)];
      if (index >= items.length) return { ...state, phase: "done" };
      return { ...state, items, index, phase: "answering", input: "", result: null, lastPoints: 0 };
    }
    case "timeUp":
      return state.phase === "done" ? state : { ...state, phase: "done" };
  }
}

/** First tries only — a retried prompt already counted as a miss. */
export function scoredAnswers(answers: readonly DojoAnswer[]): DojoAnswer[] {
  return answers.filter((a) => !a.retry);
}

/** A belt test is passed by reaching the end with at least one life left. */
export function beltPassed(state: DojoSessionState): boolean {
  return state.mode === "belt" && state.phase === "done" && (state.lives ?? 0) > 0 && state.answers.length === state.items.length;
}
