import type { AudioRef, VocabEntry } from "../types";
import { GREETINGS } from "./greetings";
import { INTRODUCTIONS, NUMBERS, PLACES, PRONOUNS } from "./identity";
import { DESCRIBING, TENER_EXPRESSIONS, VERBS } from "./essentials";
import { DETERMINERS, FAMILY, PEOPLE, SLANG } from "./people";
import { DRINKS, FOODS, RESTAURANT } from "./food";
import { ACTIONS } from "./actions";
import { PLANS } from "./plans";
import { QUESTION_WORDS } from "./questions";
import { SHOPPING } from "./shopping";
import { SOCIAL } from "./social";
import { TOWN } from "./town";
import { WORK } from "./work";
import { PAST } from "./past";
import { TRAVEL } from "./travel";
import { ROUTINE } from "./routine";
import { PRONOUN_WORDS } from "./pronouns";
import { COMMANDS } from "./commands";
import { FUTURE } from "./future";
import { COMPARE } from "./compare";
import { WOULD } from "./conditional";
import { PROGRESS } from "./progress";
import { SUBJUNCTIVE_WORDS } from "./subjunctive";
import { PREPOSITIONS } from "./prepositions";

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
  ...QUESTION_WORDS,
  ...TOWN,
  ...ACTIONS,
  ...PLANS,
  ...SHOPPING,
  ...WORK,
  ...SOCIAL,
  ...PAST,
  ...TRAVEL,
  ...ROUTINE,
  ...PRONOUN_WORDS,
  ...COMMANDS,
  ...FUTURE,
  ...COMPARE,
  ...WOULD,
  ...PROGRESS,
  ...SUBJUNCTIVE_WORDS,
  ...PREPOSITIONS,
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
