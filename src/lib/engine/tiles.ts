import type { SentenceOrderExercise } from "@/content/types";
import { seededShuffle } from "@/lib/util/random";
import { tokenize } from "./normalize";

export interface Tile {
  /** Stable id within the exercise — duplicates of the same word get distinct ids. */
  id: string;
  text: string;
}

/**
 * Build the shuffled word bank for a sentence-order exercise: every word of the
 * canonical answer, any extra words from alternative answers, plus distractors.
 */
export function buildTileBank(exercise: SentenceOrderExercise): Tile[] {
  const [canonical, ...alternatives] = exercise.answers;
  const words = tokenize(canonical);
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w.toLowerCase(), (counts.get(w.toLowerCase()) ?? 0) + 1);

  // Words that only appear in alternative answers must exist as tiles too.
  for (const alt of alternatives) {
    const altCounts = new Map<string, number>();
    for (const w of tokenize(alt)) {
      const key = w.toLowerCase();
      altCounts.set(key, (altCounts.get(key) ?? 0) + 1);
      if ((altCounts.get(key) ?? 0) > (counts.get(key) ?? 0)) {
        counts.set(key, altCounts.get(key)!);
        words.push(w);
      }
    }
  }

  const all = [...words, ...(exercise.distractors ?? [])];
  const tiles = all.map((text, i) => ({ id: `${exercise.id}-t${i}`, text }));
  return seededShuffle(tiles, exercise.id);
}
