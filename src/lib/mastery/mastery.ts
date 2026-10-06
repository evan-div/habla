import { MASTERY_CONFIG as C, RECALL_WEIGHT, type RecallKind } from "@/config/mastery";
import type { WordProgress } from "@/lib/state/types";
import { DAY } from "@/lib/util/dates";

export type MasteryBand = "weak" | "learning" | "strong";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Forgetting curve: retention is `retentionAtDue` when a review comes due
 * and keeps decaying the longer it is overdue.
 */
export function retention(daysSinceReview: number, intervalDays: number): number {
  const interval = Math.max(intervalDays, 0.25);
  return Math.pow(C.retentionAtDue, Math.max(0, daysSinceReview) / interval);
}

/** A word seen once or twice can't be "mastered", however well it went. */
export function encounterCap(timesSeen: number): number {
  return Math.min(1, C.capBase + C.capPerEncounter * timesSeen);
}

/** New recall strength after one answer. Producing > recognising; hard words grow slower. */
export function nextStrength(
  strength: number,
  correct: boolean,
  recall: RecallKind,
  difficulty: number,
): number {
  if (!correct) return clamp01(strength * C.lapseFactor - C.lapsePenalty);
  const drag = 1 - C.difficultyDrag * (difficulty - 1);
  const gain = C.baseGain * RECALL_WEIGHT[recall] * drag;
  return clamp01(strength + (1 - strength) * gain);
}

type MasteryInput = Pick<WordProgress, "strength" | "timesSeen" | "lastReviewed" | "createdAt" | "intervalDays">;

/** Displayed mastery (0–100) at a point in time: strength × retention, capped by encounters. */
export function masteryAt(word: MasteryInput, now: number): number {
  const last = word.lastReviewed ?? word.createdAt;
  const days = (now - last) / DAY;
  const raw = word.strength * retention(days, word.intervalDays);
  return Math.round(100 * Math.min(raw, encounterCap(word.timesSeen)));
}

export function masteryBand(score: number): MasteryBand {
  if (score >= C.bands.strong) return "strong";
  if (score < C.bands.weak) return "weak";
  return "learning";
}

export function createWordProgress(vocabId: string, introducedInLesson: string, now: number): WordProgress {
  return {
    vocabId,
    introducedInLesson,
    createdAt: now,
    timesSeen: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    strength: C.introStrength,
    masteryScore: Math.round(C.introStrength * 100),
    lastReviewed: null,
    lastIncorrectAt: null,
    nextReview: now,
    intervalDays: 1,
    ease: 2.5,
    repetitions: 0,
    lapses: 0,
  };
}

export interface WordAnswer {
  correct: boolean;
  recall: RecallKind;
  difficulty: number;
}

/** Fold one answer into a word's counters and strength (scheduling is separate). */
export function applyAnswer(word: WordProgress, answer: WordAnswer, now: number): WordProgress {
  const strength = nextStrength(word.strength, answer.correct, answer.recall, answer.difficulty);
  const next: WordProgress = {
    ...word,
    timesSeen: word.timesSeen + 1,
    timesCorrect: word.timesCorrect + (answer.correct ? 1 : 0),
    timesIncorrect: word.timesIncorrect + (answer.correct ? 0 : 1),
    strength,
    lastReviewed: now,
    lastIncorrectAt: answer.correct ? word.lastIncorrectAt : now,
  };
  next.masteryScore = masteryAt(next, now);
  return next;
}

/** Introduction counts as an encounter but not as a recall attempt. */
export function applyIntroduction(word: WordProgress, now: number): WordProgress {
  const next = { ...word, timesSeen: word.timesSeen + 1, lastReviewed: word.lastReviewed ?? now };
  next.masteryScore = masteryAt(next, now);
  return next;
}
