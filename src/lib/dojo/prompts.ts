import type { Person } from "@/content/types";
import { PERSONS, type Tense } from "@/lib/conjugate/conjugate";
import type { DojoFocus, DojoVerbStat } from "@/lib/state/types";
import { mulberry32, seededShuffle } from "@/lib/util/random";

export interface DojoPrompt {
  verbId: string;
  tense: Tense;
  person: Person;
}

export interface DojoPool {
  verbIds: readonly string[];
  tenses: readonly Tense[];
}

export const statKey = (verbId: string, tense: Tense) => `${verbId}:${tense}`;
const promptKey = (p: DojoPrompt) => `${p.verbId}:${p.tense}:${p.person}`;

/**
 * How often a verb + tense comes up. Misses pull it forward; unseen pairs get a
 * nudge so the whole pool gets visited. "Weak spots" leans hard on misses.
 */
function weight(stat: DojoVerbStat | undefined, focus: DojoFocus): number {
  if (!stat || stat.attempts === 0) return focus === "weak" ? 0.6 : 1.5;
  const missRate = 1 - stat.correct / stat.attempts;
  return focus === "weak" ? 0.15 + missRate * 6 : 1 + missRate * 2;
}

function weightedPick<T>(items: readonly T[], weights: readonly number[], rand: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

/** One prompt, steering clear of the verbs just seen and exact repeats. */
export function pickPrompt(
  pool: DojoPool,
  stats: Readonly<Record<string, DojoVerbStat>>,
  focus: DojoFocus,
  rand: () => number,
  recent: readonly DojoPrompt[] = [],
): DojoPrompt {
  const lastVerbs = new Set(recent.slice(-2).map((p) => p.verbId));
  const verbIds = pool.verbIds.length > 2 ? pool.verbIds.filter((id) => !lastVerbs.has(id)) : pool.verbIds;
  const pairs = verbIds.flatMap((verbId) => pool.tenses.map((tense) => ({ verbId, tense })));
  const seen = new Set(recent.map(promptKey));

  let fallback: DojoPrompt | null = null;
  for (let attempt = 0; attempt < 12; attempt++) {
    const pair = weightedPick(pairs, pairs.map((p) => weight(stats[statKey(p.verbId, p.tense)], focus)), rand);
    const prompt = { ...pair, person: PERSONS[Math.floor(rand() * PERSONS.length)] };
    if (!seen.has(promptKey(prompt))) return prompt;
    fallback ??= prompt;
  }
  return fallback!;
}

/** A fixed set of prompts (training, belt tests). Tenses take turns so a mixed pool stays mixed. */
export function buildQueue(
  pool: DojoPool,
  stats: Readonly<Record<string, DojoVerbStat>>,
  focus: DojoFocus,
  count: number,
  seed: number,
): DojoPrompt[] {
  const rand = mulberry32(seed);
  const order = seededShuffle(pool.tenses, seed);
  const queue: DojoPrompt[] = [];
  for (let i = 0; i < count; i++) {
    queue.push(pickPrompt({ verbIds: pool.verbIds, tenses: [order[i % order.length]] }, stats, focus, rand, queue));
  }
  return queue;
}
