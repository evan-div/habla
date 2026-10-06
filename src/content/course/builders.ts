import type {
  AudioSpeed,
  DialogueLine,
  Exercise,
  Lesson,
  LessonKind,
  NaturalSpeechVariant,
  Region,
} from "../types";
import { isScored } from "../types";
import { requireVocab } from "../vocabulary";
import { seededShuffle } from "@/lib/util/random";

/** An exercise before the lesson assigns it an id. */
type Draft<T> = T extends unknown ? Omit<T, "id"> : never;
export type ExerciseDraft = Draft<Exercise>;

interface Opts {
  /** Vocabulary tested. */
  v?: string | string[];
  /** Grammar concepts exercised. */
  g?: string | string[];
  /** Why the answer is right — shown after a miss. */
  why?: string;
  /** Feedback for specific wrong answers. */
  fb?: Record<string, string>;
}

const list = (x?: string | string[]) => (x === undefined ? undefined : Array.isArray(x) ? x : [x]);
const arr = (x: string | string[]) => (Array.isArray(x) ? x : [x]);

function base(o?: Opts) {
  return {
    vocabIds: list(o?.v),
    grammarIds: list(o?.g),
    explanation: o?.why,
    wrongAnswerFeedback: o?.fb,
  };
}

/** For single-word vocabulary questions, a default "why" that restates the word's meaning. */
function withMeaningWhy(o?: Opts): Opts | undefined {
  if (o?.why || typeof o?.v !== "string") return o;
  const entry = requireVocab(o.v);
  return { ...o, why: `${entry.spanish} means “${entry.english}”.` };
}

/* ---- Teaching ------------------------------------------------------ */

export const intro = (wordIds: string[], title?: string, blurb?: string): ExerciseDraft => ({
  type: "vocabularyIntroduction",
  wordIds,
  vocabIds: wordIds,
  title,
  intro: blurb,
});

export const grammarNote = (grammarId: string): ExerciseDraft => ({
  type: "grammarNote",
  grammarId,
  grammarIds: [grammarId],
});

export const natural = (
  situation: string,
  textbook: [string, string],
  variants: Array<[string, string, NaturalSpeechVariant["label"], Region?]>,
  vocab: string[],
  noteText?: string,
): ExerciseDraft => ({
  type: "naturalSpeech",
  situation,
  textbook: { es: textbook[0], en: textbook[1] },
  natural: variants.map(([es, en, label, region]) => ({ es, en, label, region })),
  note: noteText,
  vocabIds: vocab,
});

/* ---- Choice -------------------------------------------------------- */

/** “What does ‹Spanish› mean?” */
export const meaning = (es: string, answer: string, wrong: string[], o?: Opts): ExerciseDraft => ({
  type: "multipleChoice",
  prompt: "What does this mean?",
  focus: { text: es, lang: "es" },
  options: [answer, ...wrong],
  answer,
  ...base(withMeaningWhy(o)),
});

/** “How do you say ‹English› in Spanish?” */
export const sayIt = (en: string, answer: string, wrong: string[], o?: Opts): ExerciseDraft => ({
  type: "multipleChoice",
  prompt: "How do you say this in Spanish?",
  focus: { text: en, lang: "en" },
  options: [answer, ...wrong],
  answer,
  ...base(withMeaningWhy(o)),
});

/** Any multiple-choice question, optionally with a short dialogue for context. */
export const ask = (
  prompt: string,
  answer: string,
  wrong: string[],
  o?: Opts & { context?: DialogueLine[] },
): ExerciseDraft => ({
  type: "multipleChoice",
  prompt,
  context: o?.context,
  options: [answer, ...wrong],
  answer,
  ...base(o),
});

/** A grammar question — same mechanics, styled as grammar practice. */
export const gq = (
  prompt: string,
  answer: string,
  wrong: string[],
  o: Opts & { sentence?: string },
): ExerciseDraft => ({
  type: "grammar",
  prompt,
  sentence: o.sentence,
  options: [answer, ...wrong],
  answer,
  ...base(o),
});

/* ---- Typing & building -------------------------------------------- */

export const toEn = (es: string, answers: string | string[], o?: Opts): ExerciseDraft => ({
  type: "translation",
  direction: "es-en",
  source: es,
  answers: arr(answers),
  ...base(o),
});

export const toEs = (en: string, answers: string | string[], o?: Opts): ExerciseDraft => ({
  type: "translation",
  direction: "en-es",
  source: en,
  answers: arr(answers),
  ...base(o),
});

/** Build a Spanish sentence from tiles. */
export const buildEs = (en: string, answers: string | string[], distractors: string[], o?: Opts): ExerciseDraft => ({
  type: "sentenceOrder",
  direction: "en-es",
  source: en,
  answers: arr(answers),
  distractors,
  ...base(o),
});

/** Build an English sentence from tiles. */
export const buildEn = (es: string, answers: string | string[], distractors: string[], o?: Opts): ExerciseDraft => ({
  type: "sentenceOrder",
  direction: "es-en",
  source: es,
  answers: arr(answers),
  distractors,
  ...base(o),
});

export const blank = (
  sentence: string,
  answer: string,
  translation: string,
  o?: Opts & { options?: string[]; hint?: string; accepted?: string[] },
): ExerciseDraft => ({
  type: "fillBlank",
  sentence,
  translation,
  answer,
  accepted: o?.accepted,
  options: o?.options ? [answer, ...o.options.filter((x) => x !== answer)] : undefined,
  hint: o?.hint,
  ...base(o),
});

/** [vocabId, short English label]. The Spanish side comes from the vocabulary entry. */
export const match = (pairs: Array<[string, string]>, prompt?: string): ExerciseDraft => ({
  type: "matching",
  prompt,
  pairs: pairs.map(([vocabId, en]) => ({ vocabId, es: requireVocab(vocabId).spanish, en })),
  vocabIds: pairs.map(([id]) => id),
});

/* ---- Listening ----------------------------------------------------- */

export const heard = (
  text: string,
  question: string,
  answer: string,
  wrong: string[],
  o?: Opts & { translation?: string; start?: AudioSpeed },
): ExerciseDraft => ({
  type: "listening",
  mode: "choose",
  audio: { text },
  question,
  options: [answer, ...wrong],
  answer,
  translation: o?.translation,
  startSpeed: o?.start,
  ...base(o),
});

/** Listen and type what you hear. */
export const dictate = (
  text: string,
  o?: Opts & { accepted?: string[]; translation?: string; start?: AudioSpeed },
): ExerciseDraft => ({
  type: "listening",
  mode: "type",
  audio: { text },
  question: "Type what you hear",
  answer: text,
  accepted: o?.accepted,
  translation: o?.translation,
  startSpeed: o?.start,
  ...base(o),
});

/* ---- Lesson assembly ---------------------------------------------- */

export interface LessonMeta {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  kind?: LessonKind;
  minutes?: number;
  warning?: string;
}

/** Assign stable ids and shuffle option order deterministically. */
export function lesson(meta: LessonMeta, drafts: ExerciseDraft[]): Lesson {
  const exercises = drafts.map((draft, i) => {
    const id = `${meta.id}:${i + 1}`;
    const exercise = { ...draft, id } as Exercise;
    if ("options" in exercise && exercise.options) {
      exercise.options = seededShuffle(exercise.options, id);
    }
    return exercise;
  });
  const scored = exercises.filter(isScored).length;
  const teaching = exercises.length - scored;
  return {
    id: meta.id,
    unitId: meta.unitId,
    title: meta.title,
    subtitle: meta.subtitle,
    kind: meta.kind ?? "standard",
    estimatedMinutes: meta.minutes ?? Math.max(4, Math.round(scored * 0.38 + teaching * 0.7)),
    contentWarning: meta.warning,
    exercises,
  };
}
