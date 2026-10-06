import type { Gender, PartOfSpeech, Person, Region, Register, VerbData, VocabEntry } from "../types";

/** Compact authoring shape — expanded into a full VocabEntry by `entries()`. */
export interface VocabSeed {
  id: string;
  es: string;
  en: string;
  pos: PartOfSpeech;
  g?: Gender;
  /** Feminine form. */
  fem?: string;
  pl?: string;
  /** [example sentence, translation] */
  ex: [string, string];
  pron: string;
  /** Difficulty 1–5, default 1. */
  d?: 1 | 2 | 3 | 4 | 5;
  reg?: Register;
  regions?: Region[];
  note?: string;
  /** Regional notes as [region, text] pairs. */
  rn?: Array<[Region, string]>;
  rel?: string[];
  verb?: VerbData;
  /** Text to speak when it differs from the displayed form (e.g. blanks filled in). */
  aud?: string;
}

export function entries(topic: string, seeds: VocabSeed[]): VocabEntry[] {
  return seeds.map((s) => ({
    id: s.id,
    spanish: s.es,
    english: s.en,
    partOfSpeech: s.pos,
    gender: s.g,
    feminine: s.fem,
    plural: s.pl,
    exampleSentence: s.ex[0],
    exampleTranslation: s.ex[1],
    pronunciation: s.pron,
    difficulty: s.d ?? 1,
    topic,
    register: s.reg ?? "standard",
    regions: s.regions,
    note: s.note,
    regionalNotes: s.rn?.map(([region, text]) => ({ region, text })),
    verb: s.verb,
    related: s.rel,
    audio: s.aud ? { text: s.aud } : undefined,
  }));
}

/** Present-tense conjugation in the order yo · tú · él/ella/usted · nosotros · ellos/ellas/ustedes. */
export function present(forms: [string, string, string, string, string]): { present: Record<Person, string> } {
  const [yo, tu, el, nosotros, ellos] = forms;
  return { present: { yo, tu, el, nosotros, ellos } };
}
