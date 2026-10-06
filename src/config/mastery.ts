/**
 * Tunables for the word-mastery model (see lib/mastery).
 *
 * `strength` (0–1) is the learner's recall strength for a word. It grows with
 * every correct answer (more for harder-to-recall exercise types, less for
 * harder words) and drops on a miss. The *displayed* mastery additionally
 * accounts for time since last review (forgetting) and how many encounters
 * the word has had (a word seen once can't be "mastered").
 */
export const MASTERY_CONFIG = {
  /** Strength gained by a correct answer with full recall demand on an easy word. */
  baseGain: 0.34,
  /** Each difficulty step above 1 reduces the gain by this fraction. */
  difficultyDrag: 0.08,
  /** A miss multiplies strength by this… */
  lapseFactor: 0.6,
  /** …and then subtracts this. */
  lapsePenalty: 0.04,
  /** Mastery ceiling = capBase + capPerEncounter · timesSeen (≤ 1). */
  capBase: 0.4,
  capPerEncounter: 0.12,
  /** Retention at the moment a review is due. */
  retentionAtDue: 0.9,
  /** Strength granted when a word is first introduced, before any practice. */
  introStrength: 0.05,
  /** Band edges on the 0–100 mastery scale. */
  bands: { weak: 40, strong: 80 },
} as const;

/** How demanding each way of answering is. Producing > recognising. */
export const RECALL_WEIGHT = {
  multipleChoice: 0.6,
  grammar: 0.6,
  matching: 0.5,
  listeningChoose: 0.7,
  fillBlankChoose: 0.7,
  sentenceOrder: 0.85,
  fillBlankType: 1,
  listeningType: 1,
  translation: 1,
} as const;
export type RecallKind = keyof typeof RECALL_WEIGHT;
