/**
 * Content model — everything here is static, authored data.
 * Learner-specific state (mastery, streaks, …) lives in `lib/state`.
 */

/* ------------------------------------------------------------------ */
/* Language variants                                                   */
/* ------------------------------------------------------------------ */

/** Regions a word or phrase is tied to. Omit for "understood everywhere". */
export type Region = "mx" | "es" | "ar" | "co" | "caribbean";

/** Course-level dialect. The first course targets Mexican Spanish. */
export type Dialect = "es-MX" | "es-ES" | "es-AR";

export type Register = "standard" | "informal" | "slang" | "vulgar";

/* ------------------------------------------------------------------ */
/* Audio                                                               */
/* ------------------------------------------------------------------ */

export type AudioSpeed = "slow" | "normal";

/**
 * A playable clip. Today it is synthesized from `text`; when recorded audio
 * exists, fill `sources` and the player prefers it over speech synthesis.
 */
export interface AudioRef {
  text: string;
  lang?: string;
  sources?: Partial<Record<AudioSpeed, string>>;
}

/* ------------------------------------------------------------------ */
/* Vocabulary                                                          */
/* ------------------------------------------------------------------ */

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "determiner"
  | "number"
  | "expression";

export type Gender = "m" | "f";

export type Person = "yo" | "tu" | "el" | "nosotros" | "ellos";

export interface VerbData {
  infinitive: string;
  translation: string;
  regularOrIrregular: "regular" | "irregular" | "stem-changing";
  group: "ar" | "er" | "ir";
  /** e.g. "e → ie" */
  stemChange?: string;
  /** Present tense for now; other tenses get added as the course grows. */
  conjugations: { present: Record<Person, string> };
}

export interface RegionalNote {
  region: Region;
  text: string;
}

export interface VocabEntry {
  id: string;
  spanish: string;
  english: string;
  partOfSpeech: PartOfSpeech;
  gender?: Gender;
  /** Feminine form for gendered adjectives / people nouns (alto → alta). */
  feminine?: string;
  plural?: string;
  exampleSentence: string;
  exampleTranslation: string;
  /** Learner-friendly respelling, stressed syllable in caps. */
  pronunciation: string;
  /** 1 (easy) – 5 (hard); tunes how quickly mastery grows. */
  difficulty: 1 | 2 | 3 | 4 | 5;
  topic: string;
  register: Register;
  /** Tied to specific regions? Omit if universal. */
  regions?: Region[];
  /** Short teaching note shown in the word detail view. */
  note?: string;
  regionalNotes?: RegionalNote[];
  verb?: VerbData;
  /** Other entries worth surfacing next to this one. */
  related?: string[];
  audio?: AudioRef;
}

/* ------------------------------------------------------------------ */
/* Grammar                                                             */
/* ------------------------------------------------------------------ */

export interface GrammarExample {
  es: string;
  en: string;
}

export interface GrammarTable {
  caption?: string;
  headers: [string, string, ...string[]];
  rows: string[][];
}

export interface GrammarSection {
  heading: string;
  /** Plain paragraphs; **bold** is supported by the renderer. */
  body: string[];
  examples?: GrammarExample[];
  table?: GrammarTable;
}

export interface GrammarConcept {
  id: string;
  title: string;
  /** One-line hook: "to be — who or what something is". */
  tagline: string;
  /** The short version shown inside lessons. */
  summary: GrammarSection;
  /** The deeper explanation behind "Learn more". */
  deepDive: GrammarSection[];
  commonMistakes?: { wrong: string; right: string; why: string }[];
  related?: string[];
  /** Planned topics are listed on the roadmap but not teachable yet. */
  status: "available" | "planned";
}

/* ------------------------------------------------------------------ */
/* Exercises                                                           */
/* ------------------------------------------------------------------ */

export type ExerciseType =
  | "vocabularyIntroduction"
  | "grammarNote"
  | "naturalSpeech"
  | "multipleChoice"
  | "translation"
  | "fillBlank"
  | "sentenceOrder"
  | "matching"
  | "listening"
  | "grammar";

export interface DialogueLine {
  speaker: string;
  es: string;
  en?: string;
}

interface ExerciseBase {
  id: string;
  /** Words this exercise exercises — drives mastery + spaced repetition. */
  vocabIds?: string[];
  /** Grammar concepts exercised — drives grammar mastery + weak-spot tracking. */
  grammarIds?: string[];
  /** The "why" shown after any answer. */
  explanation?: string;
  /** Tailored feedback keyed by a specific wrong answer. */
  wrongAnswerFeedback?: Record<string, string>;
}

/* ---- Teaching (not scored) ---------------------------------------- */

export interface VocabularyIntroductionExercise extends ExerciseBase {
  type: "vocabularyIntroduction";
  title?: string;
  intro?: string;
  wordIds: string[];
}

export interface GrammarNoteExercise extends ExerciseBase {
  type: "grammarNote";
  grammarId: string;
}

export interface NaturalSpeechVariant {
  es: string;
  en?: string;
  label: "Standard" | "Informal" | "Slang" | "Vulgar";
  region?: Region;
}

export interface NaturalSpeechExercise extends ExerciseBase {
  type: "naturalSpeech";
  situation: string;
  textbook: { es: string; en: string };
  natural: NaturalSpeechVariant[];
  note?: string;
}

/* ---- Scored -------------------------------------------------------- */

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multipleChoice";
  prompt: string;
  /** Spanish (or English) text featured above the options, with audio. */
  focus?: { text: string; lang: "es" | "en" };
  context?: DialogueLine[];
  options: string[];
  answer: string;
}

export interface TranslationExercise extends ExerciseBase {
  type: "translation";
  direction: "es-en" | "en-es";
  /** The text to translate. */
  source: string;
  /** First entry is the canonical answer shown when wrong. */
  answers: string[];
}

export interface FillBlankExercise extends ExerciseBase {
  type: "fillBlank";
  /** Contains a single "___" marker. */
  sentence: string;
  translation: string;
  answer: string;
  accepted?: string[];
  /** With options the learner chooses; without, they type. */
  options?: string[];
  /** Optional nudge, e.g. the infinitive: "(hablar)". */
  hint?: string;
}

export interface SentenceOrderExercise extends ExerciseBase {
  type: "sentenceOrder";
  direction: "es-en" | "en-es";
  source: string;
  answers: string[];
  /** Extra tiles that do not belong in the answer. */
  distractors?: string[];
}

export interface MatchingPair {
  vocabId?: string;
  es: string;
  en: string;
}

export interface MatchingExercise extends ExerciseBase {
  type: "matching";
  prompt?: string;
  pairs: MatchingPair[];
}

export interface ListeningExercise extends ExerciseBase {
  type: "listening";
  /** What gets spoken. Provide `sources` on the AudioRef for recorded audio. */
  audio: AudioRef;
  mode: "choose" | "type";
  question: string;
  /** choose-mode only. */
  options?: string[];
  /** The correct option (choose) or the accepted transcript (type). */
  answer: string;
  accepted?: string[];
  /** Meaning of the clip, revealed after answering. */
  translation?: string;
  startSpeed?: AudioSpeed;
}

export interface GrammarExercise extends ExerciseBase {
  type: "grammar";
  prompt: string;
  /** Optional sentence under the prompt, e.g. "Yo ___ cansado." */
  sentence?: string;
  options: string[];
  answer: string;
}

export type Exercise =
  | VocabularyIntroductionExercise
  | GrammarNoteExercise
  | NaturalSpeechExercise
  | MultipleChoiceExercise
  | TranslationExercise
  | FillBlankExercise
  | SentenceOrderExercise
  | MatchingExercise
  | ListeningExercise
  | GrammarExercise;

export type ExerciseOf<T extends ExerciseType> = Extract<Exercise, { type: T }>;

/** Exercise types the learner answers (everything except pure teaching cards). */
export const SCORED_TYPES: ReadonlySet<ExerciseType> = new Set<ExerciseType>([
  "multipleChoice",
  "translation",
  "fillBlank",
  "sentenceOrder",
  "matching",
  "listening",
  "grammar",
]);

export function isScored(exercise: Exercise): boolean {
  return SCORED_TYPES.has(exercise.type);
}

/* ------------------------------------------------------------------ */
/* Course structure: Course → Sections → Units → Lessons → Exercises  */
/* ------------------------------------------------------------------ */

export type LessonKind = "standard" | "checkpoint" | "real-talk";

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  /** One-line promise: "Say hi at any time of day." */
  subtitle: string;
  kind: LessonKind;
  estimatedMinutes: number;
  /** Heads-up shown before the lesson, e.g. strong language. */
  contentWarning?: string;
  exercises: Exercise[];
}

export type UnitAccent = "teal" | "rosa" | "sol" | "leaf" | "violet";

export interface Unit {
  id: string;
  sectionId: string;
  /** 1-based across the whole course. */
  number: number;
  title: string;
  description: string;
  accent: UnitAccent;
  /** Lucide icon key resolved in the UI layer. */
  icon: string;
  lessons: Lesson[];
  /** Planned units show up on the map but cannot be started yet. */
  comingSoon?: boolean;
  /** For coming-soon units: what will be covered. */
  preview?: string[];
}

export interface Section {
  id: string;
  number: number;
  title: string;
  description: string;
  units: Unit[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  language: "es";
  dialect: Dialect;
  sections: Section[];
}
