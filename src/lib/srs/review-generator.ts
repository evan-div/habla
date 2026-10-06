import type { Exercise, Person, VocabEntry } from "@/content/types";
import { VOCABULARY, vocabClip } from "@/content/vocabulary";
import type { LearnedWord } from "@/lib/state/selectors";
import { hashString, seededShuffle } from "@/lib/util/random";

type Kind = "meaning" | "say" | "listen-choose" | "listen-type" | "type" | "blank" | "conjugate";

/** Which grammar concept a verb's conjugation drill exercises. */
const VERB_GRAMMAR: Record<string, string> = {
  ser: "ser",
  estar: "estar",
  tener: "tener",
  querer: "stem-changing",
  ir: "ir-a-infinitive",
  hablar: "present-regular",
  comer: "present-regular",
  vivir: "present-regular",
  tomar: "present-regular",
};

const PERSON_PRONOUN: Record<Person, string[]> = { yo: ["Yo"], tu: ["Tú"], el: ["Él", "Ella"], nosotros: ["Nosotros"], ellos: ["Ellos", "Ustedes"] };
const PERSONS: Person[] = ["yo", "tu", "el", "nosotros", "ellos"];

const plain = (s: string) => s.replace(/[¿?¡!]/g, "").trim();
const hasBlank = (v: VocabEntry) => v.spanish.includes("___");
const shortEnglish = (v: VocabEntry) => v.english.split(/\s*[/(]/)[0].trim();
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Distractor pool: prefer words the learner already knows, then same topic, same part of speech. */
function distractors(target: VocabEntry, field: "english" | "spanish", count: number, known: Set<string>, seed: string): string[] {
  const pool = VOCABULARY.filter((v) => v.id !== target.id && v.partOfSpeech === target.partOfSpeech && !hasBlank(v) && v[field] !== target[field]);
  const shuffled = seededShuffle(pool, `${seed}:${target.id}:${field}`);
  const rank = (v: VocabEntry) => (known.has(v.id) ? 0 : 2) + (v.topic === target.topic ? 0 : 1);
  const ordered = [...shuffled].sort((a, b) => rank(a) - rank(b));
  const out: string[] = [];
  for (const v of ordered) {
    if (!out.includes(v[field])) out.push(v[field]);
    if (out.length === count) break;
  }
  // Tiny pools (e.g. determiners): top up from anywhere so there are always enough options.
  if (out.length < count) {
    for (const v of seededShuffle(VOCABULARY, `${seed}:${target.id}:fill`)) {
      if (v.id !== target.id && !hasBlank(v) && v[field] !== target[field] && !out.includes(v[field])) out.push(v[field]);
      if (out.length === count) break;
    }
  }
  return out;
}

function blankFromExample(v: VocabEntry): { sentence: string; answer: string } | null {
  const word = plain(v.spanish);
  if (!word || hasBlank(v)) return null;
  const match = new RegExp(`(?<![\\p{L}])${escapeRegExp(word)}(?![\\p{L}])`, "iu").exec(v.exampleSentence);
  if (!match) return null;
  return { sentence: v.exampleSentence.replace(match[0], "___"), answer: match[0] };
}

function candidateKinds(w: LearnedWord): Kind[] {
  const v = w.vocab;
  const blanky = hasBlank(v);
  const canType = !blanky && plain(v.spanish).length <= 28;
  const canBlank = blankFromExample(v) !== null;
  const verb = Boolean(v.verb);
  const kinds: Kind[] =
    w.band === "weak"
      ? ["meaning", "listen-choose", "say"]
      : w.band === "learning"
        ? ["say", "listen-choose", ...(canBlank ? (["blank"] as Kind[]) : []), ...(canType ? (["type"] as Kind[]) : []), ...(verb ? (["conjugate"] as Kind[]) : [])]
        : [...(canType ? (["type", "listen-type"] as Kind[]) : []), ...(canBlank ? (["blank"] as Kind[]) : []), ...(verb ? (["conjugate"] as Kind[]) : []), "say"];
  return kinds;
}

function build(kind: Kind, w: LearnedWord, id: string, known: Set<string>, seed: string): Exercise {
  const v = w.vocab;
  const shuffle = <T,>(items: T[]) => seededShuffle(items, `${seed}:${id}`);
  const explanation = `${v.spanish} means “${v.english}”.`;
  const base = { id, vocabIds: [v.id], explanation };
  const answers = [v.spanish, ...(v.feminine ? [v.feminine] : [])];

  switch (kind) {
    case "meaning":
      return { ...base, type: "multipleChoice", prompt: "What does this mean?", focus: { text: v.spanish, lang: "es" }, options: shuffle([v.english, ...distractors(v, "english", 3, known, seed)]), answer: v.english };
    case "say":
      return { ...base, type: "multipleChoice", prompt: "How do you say this in Spanish?", focus: { text: v.english, lang: "en" }, options: shuffle([v.spanish, ...distractors(v, "spanish", 3, known, seed)]), answer: v.spanish };
    case "listen-choose":
      return { ...base, type: "listening", mode: "choose", audio: vocabClip(v), question: "What did you hear?", options: shuffle([v.english, ...distractors(v, "english", 3, known, seed)]), answer: v.english, translation: v.english };
    case "listen-type":
      return { ...base, type: "listening", mode: "type", audio: vocabClip(v), question: "Type what you hear", answer: v.spanish, accepted: v.feminine ? [v.feminine] : undefined, translation: v.english };
    case "type":
      return { ...base, type: "translation", direction: "en-es", source: v.english, answers };
    case "blank": {
      const blank = blankFromExample(v)!;
      const typed = w.band === "strong";
      return {
        ...base,
        type: "fillBlank",
        sentence: blank.sentence,
        translation: v.exampleTranslation,
        answer: blank.answer,
        options: typed ? undefined : shuffle([blank.answer, ...distractors(v, "spanish", 3, known, seed).map((d) => plain(d))]),
      };
    }
    case "conjugate": {
      const verb = v.verb!;
      const person = PERSONS[hashString(`${seed}:${id}`) % PERSONS.length];
      const pronouns = PERSON_PRONOUN[person];
      const pronoun = pronouns[hashString(`${seed}:${id}:p`) % pronouns.length];
      const form = verb.conjugations.present[person];
      return {
        ...base,
        type: "fillBlank",
        sentence: `${pronoun} ___ (${verb.infinitive}).`,
        translation: `Present tense of “${verb.infinitive}” (${verb.translation}).`,
        answer: form,
        hint: verb.infinitive,
        grammarIds: VERB_GRAMMAR[v.id] ? [VERB_GRAMMAR[v.id]] : undefined,
        explanation: `${pronoun} → ${form}. ${verb.infinitive} is ${verb.regularOrIrregular}.`,
      };
    }
  }
}

export interface ReviewBuild {
  exercises: Exercise[];
  wordIds: string[];
}

/**
 * Turn a set of words into a varied session: weaker words get recognition drills,
 * stronger ones get production (typing, dictation, cloze, conjugation). Groups of
 * four words may become a matching round.
 */
export function buildReviewExercises(words: LearnedWord[], knownIds: Set<string>, seed: string): ReviewBuild {
  const pool = [...words];
  const used: Partial<Record<Kind, number>> = {};
  const exercises: Exercise[] = [];
  const matchings: Exercise[] = [];

  // Matching rounds for the weakest words when there are enough to go around.
  const matchGroups = pool.length >= 16 ? 2 : pool.length >= 8 ? 1 : 0;
  const byWeakness = [...pool].sort((a, b) => a.mastery - b.mastery);
  for (let g = 0; g < matchGroups; g++) {
    const picked: LearnedWord[] = [];
    const labels = new Set<string>();
    for (const w of byWeakness) {
      if (picked.length === 4) break;
      const label = shortEnglish(w.vocab).toLowerCase();
      if (picked.includes(w) || labels.has(label) || hasBlank(w.vocab)) continue;
      picked.push(w);
      labels.add(label);
    }
    if (picked.length < 4) break;
    for (const w of picked) pool.splice(pool.indexOf(w), 1);
    byWeakness.splice(0, byWeakness.length, ...byWeakness.filter((w) => !picked.includes(w)));
    matchings.push({
      id: `rv-match-${g}`,
      type: "matching",
      prompt: "Match the pairs",
      pairs: picked.map((w) => ({ vocabId: w.vocab.id, es: w.vocab.spanish, en: shortEnglish(w.vocab) })),
      vocabIds: picked.map((w) => w.vocab.id),
    });
  }

  const ordered = seededShuffle(pool, `${seed}:order`);
  ordered.forEach((w, i) => {
    const kinds = candidateKinds(w);
    kinds.sort((a, b) => (used[a] ?? 0) - (used[b] ?? 0) || hashString(`${seed}:${w.vocab.id}:${a}`) - hashString(`${seed}:${w.vocab.id}:${b}`));
    const kind = kinds[0] ?? "meaning";
    used[kind] = (used[kind] ?? 0) + 1;
    exercises.push(build(kind, w, `rv-${i}-${w.vocab.id}`, knownIds, seed));
  });

  // Slot the matching rounds in at roughly a third and two-thirds of the way through.
  matchings.forEach((m, i) => exercises.splice(Math.floor((exercises.length * (i + 1)) / (matchings.length + 1)), 0, m));
  return { exercises, wordIds: words.map((w) => w.vocab.id) };
}
