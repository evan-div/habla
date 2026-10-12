import { TENSES, type Tense } from "@/lib/conjugate/conjugate";
import type { DojoFocus, LearnerState } from "@/lib/state/types";
import { BELTS, beltGrammar, beltUnit, DOJO_VERBS, getDojoVerb, TENSE_INFO, type Belt, type DojoVerb } from "./catalog";
import { statKey, type DojoPool } from "./prompts";

/** A belt test needs at least this many verbs to draw from (hablar, comer, vivir is enough for white). */
export const MIN_BELT_VERBS = 3;
/** "Weak spots" only counts a verb + tense after a few tries. */
const WEAK_MIN_ATTEMPTS = 3;

/** Tenses whose grammar lesson the learner has reached, in teaching order. */
export function unlockedTenses(state: LearnerState): Tense[] {
  return TENSES.filter((t) => Boolean(state.grammar[TENSE_INFO[t].grammarId]));
}

/** Verbs the learner has met in a lesson (or placed past). */
export function learnedDojoVerbs(state: LearnerState): DojoVerb[] {
  return DOJO_VERBS.filter((v) => Boolean(state.words[v.id]));
}

/** Pool for training and sparring: the chosen tenses (or all unlocked) and the chosen kind of verb. */
export function practicePool(state: LearnerState, tenses: readonly Tense[], focus: DojoFocus): DojoPool {
  const unlocked = unlockedTenses(state);
  const picked = tenses.filter((t) => unlocked.includes(t));
  const poolTenses = picked.length > 0 ? picked : unlocked;
  const verbs = learnedDojoVerbs(state);
  const tricky = verbs.filter((v) => !v.regular);
  const chosen = focus === "tricky" && tricky.length >= MIN_BELT_VERBS ? tricky : verbs;
  return { verbIds: chosen.map((v) => v.id), tenses: poolTenses };
}

export function beltPool(state: LearnerState, belt: Belt): DojoPool {
  const verbs = learnedDojoVerbs(state).filter((v) => belt.verbs === "all" || v.regularPresent);
  return { verbIds: verbs.map((v) => v.id), tenses: belt.tenses };
}

export type BeltState = "earned" | "next" | "locked";

export interface BeltStatus {
  belt: Belt;
  state: BeltState;
  earnedAt?: number;
  /** For the next belt: whether the test can be taken now. */
  ready: boolean;
  /** Why the next belt isn't ready yet. */
  blocker?: { kind: "unit"; unit: number | undefined } | { kind: "verbs"; have: number };
}

export function beltStatuses(state: LearnerState): BeltStatus[] {
  let foundNext = false;
  return BELTS.map((belt): BeltStatus => {
    const earned = state.dojo.belts[belt.id];
    if (earned) return { belt, state: "earned", earnedAt: earned.earnedAt, ready: false };
    if (foundNext) return { belt, state: "locked", ready: false };
    foundNext = true;
    const taught = beltGrammar(belt).every((id) => Boolean(state.grammar[id]));
    if (!taught) return { belt, state: "next", ready: false, blocker: { kind: "unit", unit: beltUnit(belt) } };
    const have = beltPool(state, belt).verbIds.length;
    if (have < MIN_BELT_VERBS) return { belt, state: "next", ready: false, blocker: { kind: "verbs", have } };
    return { belt, state: "next", ready: true };
  });
}

/** Highest belt earned so far, if any. */
export function currentBelt(state: LearnerState): Belt | undefined {
  return [...BELTS].reverse().find((b) => state.dojo.belts[b.id]);
}

export function nextBeltStatus(state: LearnerState): BeltStatus | undefined {
  return beltStatuses(state).find((s) => s.state === "next");
}

export interface WeakSpot {
  verb: DojoVerb;
  tense: Tense;
  accuracy: number;
  attempts: number;
}

/** Verb + tense pairs missed most often. */
export function weakSpots(state: LearnerState, limit = 5): WeakSpot[] {
  const out: WeakSpot[] = [];
  for (const [key, stat] of Object.entries(state.dojo.stats)) {
    if (stat.attempts < WEAK_MIN_ATTEMPTS) continue;
    const accuracy = stat.correct / stat.attempts;
    if (accuracy >= 0.9) continue;
    const [verbId, tense] = key.split(":") as [string, Tense];
    const verb = getDojoVerb(verbId);
    if (verb && TENSE_INFO[tense]) out.push({ verb, tense, accuracy, attempts: stat.attempts });
  }
  return out.sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts).slice(0, limit);
}

export function weakSpotKey(spot: WeakSpot): string {
  return statKey(spot.verb.id, spot.tense);
}
