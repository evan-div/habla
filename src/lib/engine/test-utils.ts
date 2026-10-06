import type { Exercise } from "@/content/types";
import { tokenize } from "./normalize";
import { evaluate, recallKindOf, type Response } from "./evaluate";
import type { AnswerRecord } from "@/lib/state/types";
import { isScored } from "@/content/types";

/** The response a perfect learner would give — proves an exercise is answerable. */
export function perfectResponse(ex: Exercise): Response | null {
  switch (ex.type) {
    case "multipleChoice":
    case "grammar":
      return { kind: "choice", value: ex.answer };
    case "translation":
      return { kind: "text", value: ex.answers[0] };
    case "fillBlank":
      return ex.options ? { kind: "choice", value: ex.answer } : { kind: "text", value: ex.answer };
    case "sentenceOrder":
      return { kind: "tiles", value: tokenize(ex.answers[0]) };
    case "matching":
      return { kind: "pairs", mistakes: 0, missedVocabIds: [] };
    case "listening":
      return ex.mode === "choose" ? { kind: "choice", value: ex.answer } : { kind: "text", value: ex.answer };
    default:
      return null;
  }
}

/** Play every scored exercise of a list as a perfect (or deliberately failing) learner. */
export function simulateAnswers(exercises: readonly Exercise[], opts: { allCorrect: boolean } = { allCorrect: true }): AnswerRecord[] {
  return exercises.filter(isScored).map((ex) => {
    const response = perfectResponse(ex)!;
    const evaluation = evaluate(ex, opts.allCorrect ? response : { kind: "choice", value: "__wrong__" });
    const pairIds = ex.type === "matching" ? ex.pairs.flatMap((p) => (p.vocabId ? [p.vocabId] : [])) : [];
    return {
      exerciseId: ex.id,
      type: ex.type,
      vocabIds: ex.type === "matching" ? pairIds : (ex.vocabIds ?? []),
      grammarIds: ex.grammarIds ?? [],
      correct: evaluation.correct,
      recall: recallKindOf(ex),
      retry: false,
      missedVocabIds: ex.type === "matching" && !opts.allCorrect ? pairIds : undefined,
    };
  });
}
