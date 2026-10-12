import type { Person } from "@/content/types";
import { irregularFor, type Five, type Irregular } from "./irregulars";

/**
 * A rule-based conjugator for the five persons the course teaches (no vosotros).
 * Regular endings, stem changes and spelling changes are rules; true
 * irregularities live in irregulars.ts. The present tense is checked against
 * every hand-written table in the vocabulary, so the rules can't drift.
 */

export const PERSONS: readonly Person[] = ["yo", "tu", "el", "nosotros", "ellos"];

export const TENSES = [
  "present",
  "preterite",
  "imperfect",
  "future",
  "conditional",
  "presentProgressive",
  "presentPerfect",
  "presentSubjunctive",
  "pastPerfect",
  "imperfectSubjunctive",
  "futurePerfect",
  "conditionalPerfect",
  "pastPerfectSubjunctive",
] as const;
export type Tense = (typeof TENSES)[number];

/** How the stressed stem vowel changes (pienso, puedo, juego, pido), or gains an accent (gradúo). */
export type StemChange = "e>ie" | "o>ue" | "u>ue" | "e>i" | "accent";

export interface VerbSpec {
  /** Infinitive, with -se for reflexive verbs. */
  infinitive: string;
  stemChange?: StemChange;
}

export type Forms = Record<Person, string>;

type Group = "ar" | "er" | "ir";

interface Verb {
  /** Infinitive without -se. */
  inf: string;
  stem: string;
  group: Group;
  reflexive: boolean;
  change?: StemChange;
  irr: Irregular;
}

const REFLEXIVE: Five = ["me", "te", "se", "nos", "se"];

function parse(spec: VerbSpec): Verb {
  const reflexive = /(ar|er|ir)se$/.test(spec.infinitive);
  const inf = reflexive ? spec.infinitive.slice(0, -2) : spec.infinitive;
  const group = inf.slice(-2);
  if (group !== "ar" && group !== "er" && group !== "ir") throw new Error(`Not an infinitive: ${spec.infinitive}`);
  return { inf, stem: inf.slice(0, -2), group, reflexive, change: spec.stemChange, irr: irregularFor(inf) };
}

function replaceLast(s: string, find: string, replacement: string): string {
  const i = s.lastIndexOf(find);
  return i < 0 ? s : s.slice(0, i) + replacement + s.slice(i + find.length);
}

/** The stem when the stress falls on it (the "boot" forms): pens → piens. */
function strongStem(stem: string, change: StemChange | undefined): string {
  switch (change) {
    case "e>ie":
      return replaceLast(stem, "e", "ie");
    case "o>ue":
      return replaceLast(stem, "o", "ue");
    case "u>ue":
      return replaceLast(stem, "u", "ue");
    case "e>i":
      return replaceLast(stem, "e", "i");
    case "accent": {
      const i = Math.max(stem.lastIndexOf("u"), stem.lastIndexOf("i"));
      return i < 0 ? stem : stem.slice(0, i) + (stem[i] === "u" ? "ú" : "í") + stem.slice(i + 1);
    }
    default:
      return stem;
  }
}

/** -ir stem-changers raise e → i and o → u in the preterite (pidió, durmió), gerund and nosotros subjunctive. */
function weakStem(v: Verb): string {
  if (v.group !== "ir") return v.stem;
  if (v.change === "e>ie" || v.change === "e>i") return replaceLast(v.stem, "e", "i");
  if (v.change === "o>ue") return replaceLast(v.stem, "o", "u");
  return v.stem;
}

/** Join stem + ending, keeping the consonant's sound: busqué, llegue, empecé, sigo. */
function attach(group: Group, stem: string, ending: string): string {
  const first = ending[0];
  if (group === "ar" && (first === "e" || first === "é")) {
    if (stem.endsWith("c")) return `${stem.slice(0, -1)}qu${ending}`;
    if (stem.endsWith("g")) return `${stem}u${ending}`;
    if (stem.endsWith("z")) return `${stem.slice(0, -1)}c${ending}`;
  }
  if (group !== "ar" && (first === "a" || first === "o")) {
    if (stem.endsWith("gu")) return stem.slice(0, -1) + ending;
    if (stem.endsWith("g")) return `${stem.slice(0, -1)}j${ending}`;
  }
  return stem + ending;
}

/** Stems ending in a vowel (le-, cre-, ca-) take y and written accents: leyó, leíste, leyendo. */
const endsInVowel = (stem: string) => /[aeo]$/.test(stem);

const map5 = (f: (i: number) => string): Five => [f(0), f(1), f(2), f(3), f(4)];

const PRESENT_ENDINGS: Record<Group, Five> = {
  ar: ["o", "as", "a", "amos", "an"],
  er: ["o", "es", "e", "emos", "en"],
  ir: ["o", "es", "e", "imos", "en"],
};

function present(v: Verb): Five {
  if (v.irr.present) return v.irr.present;
  const strong = strongStem(v.stem, v.change);
  const forms = map5((i) => attach(v.group, i === 3 ? v.stem : strong, PRESENT_ENDINGS[v.group][i]));
  return v.irr.yo ? [v.irr.yo, forms[1], forms[2], forms[3], forms[4]] : forms;
}

function preterite(v: Verb): Five {
  if (v.irr.preterite) return v.irr.preterite;
  const s = v.irr.preteriteStem;
  if (s) {
    const third = s.endsWith("c") ? `${s.slice(0, -1)}zo` : `${s}o`;
    return [`${s}e`, `${s}iste`, third, `${s}imos`, s.endsWith("j") ? `${s}eron` : `${s}ieron`];
  }
  if (v.group === "ar") return map5((i) => attach("ar", v.stem, (["é", "aste", "ó", "amos", "aron"] as const)[i]));
  if (endsInVowel(v.stem)) return map5((i) => v.stem + (["í", "íste", "yó", "ímos", "yeron"] as const)[i]);
  const weak = weakStem(v);
  return [`${v.stem}í`, `${v.stem}iste`, `${weak}ió`, `${v.stem}imos`, `${weak}ieron`];
}

function imperfect(v: Verb): Five {
  if (v.irr.imperfect) return v.irr.imperfect;
  const endings: Five = v.group === "ar" ? ["aba", "abas", "aba", "ábamos", "aban"] : ["ía", "ías", "ía", "íamos", "ían"];
  return map5((i) => v.stem + endings[i]);
}

const FUTURE_ENDINGS: Five = ["é", "ás", "á", "emos", "án"];
const CONDITIONAL_ENDINGS: Five = ["ía", "ías", "ía", "íamos", "ían"];

function presentSubjunctive(v: Verb): Five {
  if (v.irr.subjunctive) return v.irr.subjunctive;
  const endings: Five = v.group === "ar" ? ["e", "es", "e", "emos", "en"] : ["a", "as", "a", "amos", "an"];
  if (v.irr.yo) {
    const stem = v.irr.yo.slice(0, -1);
    return map5((i) => stem + endings[i]);
  }
  const strong = strongStem(v.stem, v.change);
  const weak = weakStem(v);
  return map5((i) => attach(v.group, i === 3 ? weak : strong, endings[i]));
}

function gerund(v: Verb): string {
  if (v.irr.gerund) return v.irr.gerund;
  if (v.group === "ar") return `${v.stem}ando`;
  if (endsInVowel(v.stem)) return `${v.stem}yendo`;
  return `${weakStem(v)}iendo`;
}

function participle(v: Verb): string {
  if (v.irr.participle) return v.irr.participle;
  if (v.group === "ar") return `${v.stem}ado`;
  return v.stem + (endsInVowel(v.stem) ? "ído" : "ido");
}

/** hablaron → habla-: the base of the imperfect subjunctive. */
function pastSubjunctiveStem(v: Verb): string {
  return preterite(v)[4].slice(0, -3);
}

const stressLast = (s: string) => s.slice(0, -1) + ({ a: "á", e: "é" }[s.slice(-1)] ?? s.slice(-1));

function pastSubjunctive(v: Verb, kind: "ra" | "se"): Five {
  const s = pastSubjunctiveStem(v);
  return [`${s}${kind}`, `${s}${kind}s`, `${s}${kind}`, `${stressLast(s)}${kind}mos`, `${s}${kind}n`];
}

const HABER: Record<"presentPerfect" | "pastPerfect" | "futurePerfect" | "conditionalPerfect" | "pastPerfectSubjunctive", Five> = {
  presentPerfect: ["he", "has", "ha", "hemos", "han"],
  pastPerfect: ["había", "habías", "había", "habíamos", "habían"],
  futurePerfect: ["habré", "habrás", "habrá", "habremos", "habrán"],
  conditionalPerfect: ["habría", "habrías", "habría", "habríamos", "habrían"],
  pastPerfectSubjunctive: ["hubiera", "hubieras", "hubiera", "hubiéramos", "hubieran"],
};
const HUBIESE: Five = ["hubiese", "hubieses", "hubiese", "hubiésemos", "hubiesen"];
const ESTAR_PRESENT: Five = ["estoy", "estás", "está", "estamos", "están"];

/** levantando → levantándome: the accent keeps the stress where it was. */
function withEnclitic(gerundForm: string, pronoun: string): string {
  return gerundForm.replace(/ando$/, "ándo").replace(/iendo$/, "iéndo").replace(/yendo$/, "yéndo") + pronoun;
}

/** Every accepted form per person; the first is the one to show. */
function formsFor(v: Verb, tense: Tense): Five[] {
  const simple = (f: Five): Five[] => [v.reflexive ? map5((i) => `${REFLEXIVE[i]} ${f[i]}`) : f];
  const compound = (aux: Five, alt?: Five): Five[] => {
    const p = participle(v);
    const build = (a: Five) => map5((i) => (v.reflexive ? `${REFLEXIVE[i]} ` : "") + `${a[i]} ${p}`);
    return alt ? [build(aux), build(alt)] : [build(aux)];
  };

  switch (tense) {
    case "present":
      return simple(present(v));
    case "preterite":
      return simple(preterite(v));
    case "imperfect":
      return simple(imperfect(v));
    case "future":
      return simple(map5((i) => (v.irr.futureStem ?? v.inf) + FUTURE_ENDINGS[i]));
    case "conditional":
      return simple(map5((i) => (v.irr.futureStem ?? v.inf) + CONDITIONAL_ENDINGS[i]));
    case "presentSubjunctive":
      return simple(presentSubjunctive(v));
    case "imperfectSubjunctive": {
      const [ra] = simple(pastSubjunctive(v, "ra"));
      const [se] = simple(pastSubjunctive(v, "se"));
      return [ra, se];
    }
    case "presentProgressive": {
      const g = gerund(v);
      if (!v.reflexive) return [map5((i) => `${ESTAR_PRESENT[i]} ${g}`)];
      return [map5((i) => `${REFLEXIVE[i]} ${ESTAR_PRESENT[i]} ${g}`), map5((i) => `${ESTAR_PRESENT[i]} ${withEnclitic(g, REFLEXIVE[i])}`)];
    }
    case "pastPerfectSubjunctive":
      return compound(HABER.pastPerfectSubjunctive, HUBIESE);
    case "presentPerfect":
    case "pastPerfect":
    case "futurePerfect":
    case "conditionalPerfect":
      return compound(HABER[tense]);
  }
}

/** Every accepted answer for each person, the preferred one first (hablara before hablase). */
export function acceptedForms(spec: VerbSpec, tense: Tense): Record<Person, string[]> {
  const sets = formsFor(parse(spec), tense);
  const out = {} as Record<Person, string[]>;
  PERSONS.forEach((p, i) => (out[p] = sets.map((s) => s[i])));
  return out;
}

/** The preferred form for each person. */
export function conjugate(spec: VerbSpec, tense: Tense): Forms {
  const [main] = formsFor(parse(spec), tense);
  const out = {} as Forms;
  PERSONS.forEach((p, i) => (out[p] = main[i]));
  return out;
}

export function pastParticiple(spec: VerbSpec): string {
  return participle(parse(spec));
}

export function presentParticiple(spec: VerbSpec): string {
  return gerund(parse(spec));
}

/**
 * Read a verb's stem change off its present-tense él form, so content authors
 * only ever write the present table: (pensar, "piensa") → "e>ie".
 */
export function inferStemChange(infinitive: string, elPresent: string): StemChange | undefined {
  const v = parse({ infinitive });
  const word = elPresent.split(" ").at(-1) ?? "";
  const elStem = word.slice(0, -1);
  if (elStem === v.stem) return undefined;
  const changes: StemChange[] = ["e>ie", "o>ue", "u>ue", "e>i", "accent"];
  return changes.find((c) => strongStem(v.stem, c) === elStem);
}
