import type { AudioRef, VocabEntry } from "../types";
import { GREETINGS } from "./greetings";
import { INTRODUCTIONS, NUMBERS, PLACES, PRONOUNS } from "./identity";
import { DESCRIBING, TENER_EXPRESSIONS, VERBS } from "./essentials";
import { DETERMINERS, FAMILY, PEOPLE, SLANG } from "./people";
import { DRINKS, FOODS, RESTAURANT } from "./food";

export const VOCABULARY: readonly VocabEntry[] = [
  ...GREETINGS,
  ...PRONOUNS,
  ...INTRODUCTIONS,
  ...PLACES,
  ...NUMBERS,
  ...VERBS,
  ...DESCRIBING,
  ...TENER_EXPRESSIONS,
  ...FAMILY,
  ...PEOPLE,
  ...DETERMINERS,
  ...SLANG,
  ...DRINKS,
  ...FOODS,
  ...RESTAURANT,
];

const BY_ID: ReadonlyMap<string, VocabEntry> = new Map(VOCABULARY.map((v) => [v.id, v]));

export function getVocab(id: string): VocabEntry | undefined {
  return BY_ID.get(id);
}

/** Like getVocab, but fails loudly — content references are validated by tests. */
export function requireVocab(id: string): VocabEntry {
  const entry = BY_ID.get(id);
  if (!entry) throw new Error(`Unknown vocabulary id: "${id}"`);
  return entry;
}

export function vocabByTopic(topic: string): VocabEntry[] {
  return VOCABULARY.filter((v) => v.topic === topic);
}

/** What to play for a word: an explicit clip, or its Spanish form. */
export function vocabClip(entry: VocabEntry): AudioRef {
  return entry.audio ?? { text: entry.spanish };
}
