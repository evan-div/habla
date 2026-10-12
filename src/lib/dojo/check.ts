import type { Person } from "@/content/types";
import { acceptedForms, PERSONS, TENSES, type Tense, type VerbSpec } from "@/lib/conjugate/conjugate";
import { normalizeText, stripAccents } from "@/lib/engine/normalize";

export type DojoCheck =
  | { correct: true; answer: string }
  | {
      correct: false;
      answer: string;
      /** accent: right letters, wrong accents · other-form: a real form of this verb, just not this one. */
      reason: "accent" | "other-form" | "wrong" | "blank";
      /** Every person that shares the form in that tense (hubiera: yo and él). */
      otherForm?: { tense: Tense; persons: Person[] };
    };

/** Subject pronouns learners often type out of habit; they're fine, so they're ignored. */
const SUBJECT_PRONOUN = /^(yo|tú|tu|él|el|ella|usted|ud|nosotros|nosotras|ellos|ellas|ustedes|uds) /;

export function normalizeConjugation(input: string): string {
  return normalizeText(input, "es").replace(SUBJECT_PRONOUN, "");
}

type FormOwner = { tense: Tense; persons: Person[] };
const formIndex = new Map<string, Map<string, FormOwner>>();

/** Every form of a verb → the first tense it belongs to, and who uses it there (hablo → present · yo). */
function indexFor(spec: VerbSpec): Map<string, FormOwner> {
  const key = `${spec.infinitive}|${spec.stemChange ?? ""}`;
  let index = formIndex.get(key);
  if (!index) {
    index = new Map();
    for (const tense of TENSES) {
      const forms = acceptedForms(spec, tense);
      for (const person of PERSONS) {
        for (const form of forms[person]) {
          const n = normalizeConjugation(form);
          const owner = index.get(n);
          if (!owner) index.set(n, { tense, persons: [person] });
          else if (owner.tense === tense && !owner.persons.includes(person)) owner.persons.push(person);
        }
      }
    }
    formIndex.set(key, index);
  }
  return index;
}

/**
 * Strict on purpose: in the Dojo the accent is part of the answer (hablo ≠ habló),
 * and one-letter "typos" are usually a different person (habla ≠ hablas).
 */
export function checkConjugation(spec: VerbSpec, tense: Tense, person: Person, input: string): DojoCheck {
  const accepted = acceptedForms(spec, tense)[person];
  const answer = accepted[0];
  const given = normalizeConjugation(input);
  if (!given) return { correct: false, answer, reason: "blank" };
  if (accepted.some((a) => normalizeConjugation(a) === given)) return { correct: true, answer };

  const other = indexFor(spec).get(given);
  if (other) return { correct: false, answer, reason: "other-form", otherForm: other };
  const bare = stripAccents(given);
  if (accepted.some((a) => stripAccents(normalizeConjugation(a)) === bare)) return { correct: false, answer, reason: "accent" };
  return { correct: false, answer, reason: "wrong" };
}
