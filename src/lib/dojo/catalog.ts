import { ALL_LESSONS, grammarTaught, unitOfLesson } from "@/content/course";
import { VOCABULARY } from "@/content/vocabulary";
import { inferStemChange, TENSES, type Tense, type VerbSpec } from "@/lib/conjugate/conjugate";
import { hasIrregularEntry } from "@/lib/conjugate/irregulars";

/* ---- Tenses -------------------------------------------------------- */

export interface TenseInfo {
  id: Tense;
  label: string;
  /** English gloss using "speak", so the tense reads at a glance. */
  example: string;
  /** Grammar topic whose lesson opens this tense in the Dojo. */
  grammarId: string;
}

export const TENSE_INFO: Readonly<Record<Tense, TenseInfo>> = {
  present: { id: "present", label: "Present", example: "I speak", grammarId: "present-regular" },
  preterite: { id: "preterite", label: "Preterite", example: "I spoke", grammarId: "preterite-ar" },
  imperfect: { id: "imperfect", label: "Imperfect", example: "I used to speak", grammarId: "imperfect-regular" },
  future: { id: "future", label: "Future", example: "I will speak", grammarId: "future-regular" },
  conditional: { id: "conditional", label: "Conditional", example: "I would speak", grammarId: "conditional-regular" },
  presentProgressive: { id: "presentProgressive", label: "Present progressive", example: "I'm speaking", grammarId: "present-progressive" },
  presentPerfect: { id: "presentPerfect", label: "Present perfect", example: "I have spoken", grammarId: "present-perfect" },
  presentSubjunctive: { id: "presentSubjunctive", label: "Present subjunctive", example: "…that I speak", grammarId: "subjunctive-present" },
  pastPerfect: { id: "pastPerfect", label: "Past perfect", example: "I had spoken", grammarId: "past-perfect" },
  imperfectSubjunctive: { id: "imperfectSubjunctive", label: "Imperfect subjunctive", example: "…if I spoke", grammarId: "imperfect-subjunctive" },
  futurePerfect: { id: "futurePerfect", label: "Future perfect", example: "I will have spoken", grammarId: "future-perfect" },
  conditionalPerfect: { id: "conditionalPerfect", label: "Conditional perfect", example: "I would have spoken", grammarId: "conditional-perfect" },
  pastPerfectSubjunctive: { id: "pastPerfectSubjunctive", label: "Past perfect subjunctive", example: "…if I had spoken", grammarId: "past-perfect-subjunctive" },
};

/** Unit number where each grammar topic is first taught. */
const TAUGHT_IN_UNIT: ReadonlyMap<string, number> = (() => {
  const map = new Map<string, number>();
  for (const lesson of ALL_LESSONS) {
    const unit = unitOfLesson(lesson.id);
    if (!unit) continue;
    for (const id of grammarTaught(lesson)) if (!map.has(id)) map.set(id, unit.number);
  }
  return map;
})();

export function unitTeaching(grammarId: string): number | undefined {
  return TAUGHT_IN_UNIT.get(grammarId);
}

/* ---- Belts --------------------------------------------------------- */

export interface Belt {
  id: string;
  name: string;
  /** Mexican Spanish: "cinta" for a martial-arts belt, "café" for brown. */
  spanish: string;
  /** What the belt test drills. */
  focus: string;
  tenses: readonly Tense[];
  /** White belt sticks to verbs that are regular in the present. */
  verbs: "regular" | "all";
  /** Grammar the learner must have met beyond the tenses themselves. */
  requires: readonly string[];
  /** Belt fill; fixed colors that read on light and dark surfaces. */
  color: string;
  /** Stripe/knot color drawn over the fill. */
  ink: string;
}

export const BELTS: readonly Belt[] = [
  { id: "white", name: "White belt", spanish: "Cinta blanca", focus: "Present tense · regular verbs", tenses: ["present"], verbs: "regular", requires: [], color: "#f6f2e9", ink: "#b9b2a3" },
  { id: "yellow", name: "Yellow belt", spanish: "Cinta amarilla", focus: "Present tense · every verb", tenses: ["present"], verbs: "all", requires: ["stem-changing"], color: "#f7c531", ink: "#a37a00" },
  { id: "orange", name: "Orange belt", spanish: "Cinta naranja", focus: "Preterite", tenses: ["preterite"], verbs: "all", requires: [], color: "#f08a2c", ink: "#9a4b06" },
  { id: "green", name: "Green belt", spanish: "Cinta verde", focus: "Preterite and imperfect", tenses: ["preterite", "imperfect"], verbs: "all", requires: [], color: "#2f9e55", ink: "#145a2c" },
  { id: "blue", name: "Blue belt", spanish: "Cinta azul", focus: "Future and conditional", tenses: ["future", "conditional"], verbs: "all", requires: [], color: "#2f6fd6", ink: "#123d84" },
  { id: "brown", name: "Brown belt", spanish: "Cinta café", focus: "Progressive, present perfect and subjunctive", tenses: ["presentProgressive", "presentPerfect", "presentSubjunctive"], verbs: "all", requires: [], color: "#8a5a35", ink: "#4d2e16" },
  { id: "black", name: "Black belt", spanish: "Cinta negra", focus: "Every tense, all mixed up", tenses: TENSES, verbs: "all", requires: [], color: "#222126", ink: "#c9a227" },
];

export function getBelt(id: string): Belt | undefined {
  return BELTS.find((b) => b.id === id);
}

/** Grammar topics a belt needs: its tenses plus any extras. */
export function beltGrammar(belt: Belt): string[] {
  return [...new Set([...belt.tenses.map((t) => TENSE_INFO[t].grammarId), ...belt.requires])];
}

/** The unit where a belt's last requirement is taught. */
export function beltUnit(belt: Belt): number | undefined {
  const units = beltGrammar(belt).map(unitTeaching);
  return units.some((u) => u === undefined) ? undefined : Math.max(...(units as number[]));
}

export const BELT_TEST = { length: 20, lives: 3 } as const;

/* ---- Verbs --------------------------------------------------------- */

export interface DojoVerb {
  /** Vocabulary id (also the key for the learner's progress). */
  id: string;
  infinitive: string;
  english: string;
  spec: VerbSpec;
  /** Fully regular: no stem change, spelling change or irregular form anywhere. */
  regular: boolean;
  /** Regular in the present tense (llegar, leer), which is all the white belt asks. */
  regularPresent: boolean;
}

/** -car, -gar, -zar, -guir… verbs change spelling in the preterite or subjunctive. */
const SPELLING_CHANGE = /(car|gar|zar|guir|ger|gir)(se)?$/;

export const DOJO_VERBS: readonly DojoVerb[] = VOCABULARY.flatMap((entry): DojoVerb[] => {
  const verb = entry.verb;
  if (!verb) return [];
  const stemChange = inferStemChange(verb.infinitive, verb.conjugations.present.el);
  const bare = verb.infinitive.replace(/(ar|er|ir)se$/, "$1");
  const regularPresent = verb.regularOrIrregular === "regular" && !stemChange;
  const regular = regularPresent && !hasIrregularEntry(bare) && !SPELLING_CHANGE.test(verb.infinitive) && !/[aeo](er|ir)$/.test(bare);
  return [{ id: entry.id, infinitive: verb.infinitive, english: entry.english, spec: { infinitive: verb.infinitive, stemChange }, regular, regularPresent }];
});

const VERB_BY_ID = new Map(DOJO_VERBS.map((v) => [v.id, v]));

export function getDojoVerb(id: string): DojoVerb | undefined {
  return VERB_BY_ID.get(id);
}
