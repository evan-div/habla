import type { Exercise } from "@/content/types";
import { isScored } from "@/content/types";
import type { AnswerRecord, MistakeRecord } from "@/lib/state/types";
import { evaluate, exercisePrompt, recallKindOf, type Evaluation, type Response } from "./evaluate";

export interface QueueItem {
  /** Unique within the queue (retries get a suffix). */
  key: string;
  exercise: Exercise;
  retry: boolean;
}

export interface SessionState {
  queue: QueueItem[];
  index: number;
  phase: "answering" | "feedback" | "done";
  response: Response | null;
  evaluation: Evaluation | null;
  answers: AnswerRecord[];
  mistakes: MistakeRecord[];
  correctStreak: number;
  introducedVocabIds: string[];
  seenGrammarIds: string[];
  /** Size of the original lesson (without retries), for the progress bar. */
  baseLength: number;
}

export type SessionAction =
  | { type: "respond"; response: Response | null }
  | { type: "check" }
  | { type: "skip" }
  | { type: "continue" };

export function initSession(exercises: readonly Exercise[]): SessionState {
  return {
    queue: exercises.map((exercise) => ({ key: exercise.id, exercise, retry: false })),
    index: 0,
    phase: exercises.length === 0 ? "done" : "answering",
    response: null,
    evaluation: null,
    answers: [],
    mistakes: [],
    correctStreak: 0,
    introducedVocabIds: [],
    seenGrammarIds: [],
    baseLength: exercises.length,
  };
}

export const currentItem = (s: SessionState): QueueItem | undefined => s.queue[s.index];

/** A response that is guaranteed wrong — used by "I don't know" so the answer gets revealed. */
function giveUpResponse(exercise: Exercise): Response {
  switch (exercise.type) {
    case "sentenceOrder":
      return { kind: "tiles", value: [] };
    case "matching":
      return { kind: "pairs", mistakes: exercise.pairs.length, missedVocabIds: exercise.pairs.flatMap((p) => (p.vocabId ? [p.vocabId] : [])) };
    case "translation":
    case "listening":
    case "fillBlank":
      return { kind: "text", value: "" };
    default:
      return { kind: "choice", value: "" };
  }
}

function grade(state: SessionState, response: Response): SessionState {
  const item = currentItem(state);
  if (!item || !isScored(item.exercise)) return state;
  const { exercise, retry } = item;
  const evaluation = evaluate(exercise, response);

  const record: AnswerRecord = {
    exerciseId: exercise.id,
    type: exercise.type,
    vocabIds: exercise.type === "matching" ? exercise.pairs.flatMap((p) => (p.vocabId ? [p.vocabId] : [])) : (exercise.vocabIds ?? []),
    grammarIds: exercise.grammarIds ?? [],
    correct: evaluation.correct,
    close: Boolean(evaluation.close),
    recall: recallKindOf(exercise),
    retry,
    missedVocabIds: evaluation.missedVocabIds,
  };

  const queue = [...state.queue];
  const mistakes = [...state.mistakes];
  if (!evaluation.correct && !retry) {
    mistakes.push({
      exerciseId: exercise.id,
      prompt: exercisePrompt(exercise),
      yourAnswer: evaluation.yourAnswer || "(no answer)",
      correctAnswer: evaluation.correctAnswer,
      explanation: evaluation.mistakeHint ?? evaluation.explanation,
    });
    // Missed exercises come back once at the end — matching is low-stakes, so it doesn't.
    if (exercise.type !== "matching") queue.push({ key: `${exercise.id}#retry`, exercise, retry: true });
  }

  return {
    ...state,
    queue,
    mistakes,
    answers: [...state.answers, record],
    evaluation,
    response,
    phase: "feedback",
    correctStreak: evaluation.correct ? state.correctStreak + 1 : 0,
  };
}

function advance(state: SessionState): SessionState {
  const item = currentItem(state);
  let { introducedVocabIds, seenGrammarIds } = state;

  // Teaching cards count as "seen" when the learner moves past them.
  if (item && !isScored(item.exercise)) {
    const ex = item.exercise;
    if (ex.type === "vocabularyIntroduction") introducedVocabIds = [...new Set([...introducedVocabIds, ...ex.wordIds])];
    else if (ex.type === "naturalSpeech") introducedVocabIds = [...new Set([...introducedVocabIds, ...(ex.vocabIds ?? [])])];
    else if (ex.type === "grammarNote") seenGrammarIds = [...new Set([...seenGrammarIds, ex.grammarId])];
  }

  const index = state.index + 1;
  return {
    ...state,
    index,
    introducedVocabIds,
    seenGrammarIds,
    response: null,
    evaluation: null,
    phase: index >= state.queue.length ? "done" : "answering",
  };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "respond":
      return state.phase === "answering" ? { ...state, response: action.response } : state;
    case "check":
      return state.phase === "answering" && state.response ? grade(state, state.response) : state;
    case "skip": {
      const item = currentItem(state);
      return state.phase === "answering" && item ? grade(state, giveUpResponse(item.exercise)) : state;
    }
    case "continue": {
      const item = currentItem(state);
      if (state.phase === "feedback") return advance(state);
      // Teaching cards advance straight away.
      if (state.phase === "answering" && item && !isScored(item.exercise)) return advance(state);
      return state;
    }
  }
}

/** 0–1 progress through the lesson. */
export function sessionProgress(state: SessionState): number {
  if (state.queue.length === 0) return 1;
  return Math.min(1, state.index / state.queue.length);
}
