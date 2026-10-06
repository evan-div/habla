"use client";

import { Check, Info, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { Button } from "@/components/ui/Button";
import type { Exercise } from "@/content/types";
import type { Evaluation } from "@/lib/engine/evaluate";
import { cn } from "@/lib/util/cn";

const PRAISE = ["¡Muy bien!", "¡Excelente!", "¡Perfecto!", "¡Eso es!", "¡Bien hecho!", "¡Así se hace!"];

/** The Spanish text worth hearing once the answer is revealed, if any. */
function spokenAnswer(exercise: Exercise, evaluation: Evaluation): string | null {
  switch (exercise.type) {
    case "translation":
    case "sentenceOrder":
      return exercise.direction === "en-es" ? evaluation.correctAnswer : null;
    case "fillBlank":
      return exercise.sentence.replace("___", evaluation.correctAnswer);
    case "listening":
      return exercise.audio.text;
    case "multipleChoice":
      return exercise.focus?.lang === "en" ? evaluation.correctAnswer : null;
    default:
      return null;
  }
}

/** What to show as "Better:" — fill-in answers read best as the whole corrected sentence. */
function displayAnswer(exercise: Exercise, evaluation: Evaluation): string {
  if (exercise.type === "fillBlank") return exercise.sentence.replace("___", evaluation.correctAnswer);
  if (exercise.type === "grammar" && exercise.sentence) return exercise.sentence.replace("___", evaluation.correctAnswer);
  return evaluation.correctAnswer;
}

interface FeedbackPanelProps {
  exercise: Exercise;
  evaluation: Evaluation;
  streak: number;
  retry: boolean;
  /** Count of answers so far — rotates the praise phrase. */
  answerCount: number;
  onContinue: () => void;
}

export function FeedbackPanel({ exercise, evaluation, streak, retry, answerCount, onContinue }: FeedbackPanelProps) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => button.current?.focus(), []);

  const { correct, close } = evaluation;
  const spoken = spokenAnswer(exercise, evaluation);
  const why = evaluation.mistakeHint ?? evaluation.explanation;
  const tone = correct && !close ? "good" : correct ? "close" : "bad";

  const headline = correct
    ? close === "accent"
      ? "Almost — mind the accent"
      : close === "typo"
        ? "Nice — tiny typo"
        : PRAISE[answerCount % PRAISE.length]
    : retry
      ? "Keep going — you'll get it"
      : "Not quite";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "animate-rise border-t-4",
        tone === "good" && "border-leaf-500 bg-soft-leaf text-on-leaf",
        tone === "close" && "border-sol-400 bg-soft-sol text-on-sol",
        tone === "bad" && "border-chili-500 bg-soft-chili text-on-chili",
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full text-white",
              tone === "good" && "bg-leaf-500",
              tone === "close" && "bg-sol-500",
              tone === "bad" && "bg-chili-500",
            )}
            aria-hidden="true"
          >
            {tone === "good" ? <Check size={22} strokeWidth={3} /> : tone === "close" ? <Info size={22} strokeWidth={3} /> : <X size={22} strokeWidth={3} />}
          </span>
          <div className="min-w-0 text-ink">
            <p className="font-display text-2xl font-extrabold leading-tight">
              {headline}
              {correct && streak >= 3 && <span className="ml-2 align-middle text-sm font-bold text-on-sol">🔥 {streak} in a row</span>}
            </p>

            {(!correct || close) && (
              <dl className="mt-2 space-y-1">
                {!correct && evaluation.yourAnswer && exercise.type !== "matching" && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-bold text-muted">Your answer:</dt>
                    <dd className="font-semibold line-through decoration-chili-500/70 decoration-2">{evaluation.yourAnswer}</dd>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-x-2">
                  <dt className="font-bold text-muted">{close ? "Correct spelling:" : exercise.type === "matching" ? "The pairs:" : "Better:"}</dt>
                  <dd className="font-display text-lg font-extrabold">{displayAnswer(exercise, evaluation)}</dd>
                  {spoken && <AudioButton clip={{ text: spoken }} size="sm" label="Hear the correct answer" className="!h-8 !w-8" />}
                </div>
              </dl>
            )}

            {!correct && why && (
              <p className="mt-2 max-w-xl leading-relaxed">
                <span className="font-extrabold">Why? </span>
                {why}
              </p>
            )}
            {correct && exercise.type === "listening" && exercise.translation && (
              <p className="mt-1 text-muted">“{exercise.translation}”</p>
            )}
          </div>
        </div>

        <Button
          ref={button}
          size="lg"
          variant={correct && !close ? "success" : correct ? "primary" : "danger"}
          onClick={onContinue}
          className="w-full shrink-0 sm:w-auto sm:min-w-44"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
