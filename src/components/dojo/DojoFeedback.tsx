"use client";

import { Check, Info, X } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { PERSON_LABEL } from "@/components/grammar/ConjugationTable";
import { Button } from "@/components/ui/Button";
import { TENSE_INFO } from "@/lib/dojo/catalog";
import type { DojoCheck } from "@/lib/dojo/check";
import { stripAccents } from "@/lib/engine/normalize";
import { cn } from "@/lib/util/cn";

const PRAISE = ["¡Eso!", "¡Perfecto!", "¡Muy bien!", "¡Así se hace!", "¡Bien hecho!"];

/** Why the answer missed, in one line. */
function missNote(result: Extract<DojoCheck, { correct: false }>, given: string): string | null {
  switch (result.reason) {
    case "other-form": {
      const other = result.otherForm!;
      const accentOnly = stripAccents(given.toLowerCase()) === stripAccents(result.answer);
      const who = other.persons.map((p) => PERSON_LABEL[p]).join(" and ");
      return `“${given}” is the ${who} form of the ${TENSE_INFO[other.tense].label.toLowerCase()}${accentOnly ? " — the accent changes the meaning" : ""}.`;
    }
    case "accent":
      return "Right letters — but in the Dojo the accent is part of the answer.";
    case "blank":
      return null;
    case "wrong":
      return null;
  }
}

interface DojoFeedbackProps {
  result: DojoCheck;
  given: string;
  /** Answers so far — rotates the praise phrase. */
  answerCount: number;
  points: number;
  combo: number;
  /** Sparring moves on by itself; the others wait for Continue. */
  onContinue?: () => void;
}

export function DojoFeedback({ result, given, answerCount, points, combo, onContinue }: DojoFeedbackProps) {
  const tone = result.correct ? "good" : result.reason === "accent" ? "close" : "bad";
  const note = result.correct ? null : missNote(result, given);

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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
              {result.correct ? PRAISE[answerCount % PRAISE.length] : result.reason === "accent" ? "Mind the accent" : result.reason === "blank" ? "Here it is" : "Not quite"}
              {points > 0 && <span className="ml-2 align-middle text-base font-extrabold text-on-sol">+{points}</span>}
              {result.correct && combo >= 3 && <span className="ml-2 align-middle text-sm font-bold text-on-sol">🔥 {combo} in a row</span>}
            </p>
            {!result.correct && (
              <>
                <p className="mt-1 flex flex-wrap items-center gap-x-2">
                  {given && <span className="font-semibold line-through decoration-chili-500/70 decoration-2">{given}</span>}
                  <span className="font-bold text-muted">→</span>
                  <span lang="es" className="font-display text-xl font-extrabold">{result.answer}</span>
                  <AudioButton clip={{ text: result.answer }} size="sm" label="Hear the correct form" className="!h-8 !w-8" />
                </p>
                {note && <p className="mt-1 max-w-xl leading-relaxed">{note}</p>}
              </>
            )}
          </div>
        </div>
        {onContinue && (
          <Button size="lg" variant={tone === "good" ? "success" : tone === "close" ? "primary" : "danger"} onClick={onContinue} className="w-full shrink-0 sm:w-auto sm:min-w-44">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
