import type { Exercise } from "@/content/types";
import type { RecallKind } from "@/config/mastery";
import { matchText, normalizeText } from "./normalize";

/** What the learner submitted. Shape depends on the exercise UI. */
export type Response =
  | { kind: "choice"; value: string }
  | { kind: "text"; value: string }
  | { kind: "tiles"; value: string[] }
  | { kind: "pairs"; mistakes: number; missedVocabIds: string[] };

export interface Evaluation {
  correct: boolean;
  /** Counted as correct, but with a gentle note about a small slip. */
  close?: "accent" | "typo";
  yourAnswer: string;
  correctAnswer: string;
  /** Generic "why" for this exercise. */
  explanation?: string;
  /** Feedback specific to the wrong answer given. */
  mistakeHint?: string;
  missedVocabIds?: string[];
}

/** Matching tolerates one slip so a single fumble doesn't fail the round. */
export const MATCHING_FREE_MISTAKES = 1;

export function responseToText(response: Response): string {
  switch (response.kind) {
    case "choice":
    case "text":
      return response.value;
    case "tiles":
      return response.value.join(" ");
    case "pairs":
      return response.mistakes === 0 ? "All pairs matched" : `${response.mistakes} mismatches`;
  }
}

function fromMatch(
  match: ReturnType<typeof matchText>,
  base: Pick<Evaluation, "yourAnswer" | "correctAnswer" | "explanation">,
): Evaluation {
  if (match.result === "wrong") return { correct: false, ...base };
  if (match.result === "exact") return { correct: true, ...base, correctAnswer: match.matched };
  return { correct: true, close: match.result, ...base, correctAnswer: match.matched };
}

export function evaluate(exercise: Exercise, response: Response): Evaluation {
  const yourAnswer = responseToText(response);
  const explanation = exercise.explanation;

  switch (exercise.type) {
    case "multipleChoice":
    case "grammar": {
      const correct = response.kind === "choice" && response.value === exercise.answer;
      return {
        correct,
        yourAnswer,
        correctAnswer: exercise.answer,
        explanation,
        mistakeHint: correct ? undefined : exercise.wrongAnswerFeedback?.[yourAnswer],
      };
    }

    case "fillBlank": {
      const accepted = [exercise.answer, ...(exercise.accepted ?? [])];
      const base = { yourAnswer, correctAnswer: exercise.answer, explanation };
      const hint = exercise.wrongAnswerFeedback?.[yourAnswer];
      if (exercise.options) {
        const correct = accepted.includes(yourAnswer);
        return { correct, ...base, mistakeHint: correct ? undefined : hint };
      }
      const result = fromMatch(matchText(yourAnswer, accepted, "es"), base);
      return result.correct ? result : { ...result, mistakeHint: hint };
    }

    case "translation": {
      const lang = exercise.direction === "es-en" ? "en" : "es";
      const result = fromMatch(matchText(yourAnswer, exercise.answers, lang), {
        yourAnswer,
        correctAnswer: exercise.answers[0],
        explanation,
      });
      return result.correct
        ? result
        : { ...result, mistakeHint: exercise.wrongAnswerFeedback?.[normalizeText(yourAnswer, lang)] };
    }

    case "sentenceOrder": {
      const lang = exercise.direction === "es-en" ? "en" : "es";
      const sentence = response.kind === "tiles" ? response.value.join(" ") : yourAnswer;
      const result = fromMatch(matchText(sentence, exercise.answers, lang), {
        yourAnswer: sentence,
        correctAnswer: exercise.answers[0],
        explanation,
      });
      return result.correct ? result : { ...result, mistakeHint: exercise.wrongAnswerFeedback?.[sentence] };
    }

    case "listening": {
      const base = { yourAnswer, correctAnswer: exercise.answer, explanation };
      if (exercise.mode === "choose") {
        const correct = response.kind === "choice" && response.value === exercise.answer;
        return { correct, ...base, mistakeHint: correct ? undefined : exercise.wrongAnswerFeedback?.[yourAnswer] };
      }
      return fromMatch(matchText(yourAnswer, [exercise.answer, ...(exercise.accepted ?? [])], "es"), base);
    }

    case "matching": {
      const mistakes = response.kind === "pairs" ? response.mistakes : 0;
      const missed = response.kind === "pairs" ? response.missedVocabIds : [];
      return {
        correct: mistakes <= MATCHING_FREE_MISTAKES,
        yourAnswer,
        correctAnswer: exercise.pairs.map((p) => `${p.es} = ${p.en}`).join(" · "),
        explanation,
        missedVocabIds: missed,
      };
    }

    default:
      // Teaching cards are never evaluated.
      return { correct: true, yourAnswer: "", correctAnswer: "" };
  }
}

/** How demanding this exercise is on recall — feeds the mastery model. */
export function recallKindOf(exercise: Exercise): RecallKind {
  switch (exercise.type) {
    case "multipleChoice":
      return "multipleChoice";
    case "grammar":
      return "grammar";
    case "matching":
      return "matching";
    case "sentenceOrder":
      return "sentenceOrder";
    case "translation":
      return "translation";
    case "fillBlank":
      return exercise.options ? "fillBlankChoose" : "fillBlankType";
    case "listening":
      return exercise.mode === "type" ? "listeningType" : "listeningChoose";
    default:
      return "multipleChoice";
  }
}

/** Short label for the mistakes review ("What does 'hola' mean?"). */
export function exercisePrompt(exercise: Exercise): string {
  switch (exercise.type) {
    case "multipleChoice":
      return exercise.focus ? `${exercise.prompt} “${exercise.focus.text}”` : exercise.prompt;
    case "grammar":
      return exercise.sentence ? `${exercise.prompt} ${exercise.sentence}` : exercise.prompt;
    case "translation":
    case "sentenceOrder":
      return `Translate: “${exercise.source}”`;
    case "fillBlank":
      return `Complete: ${exercise.sentence}`;
    case "listening":
      return exercise.question;
    case "matching":
      return exercise.prompt ?? "Match the pairs";
    default:
      return "";
  }
}
