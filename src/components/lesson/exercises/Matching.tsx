"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from "@/components/audio/useAudio";
import type { MatchingExercise } from "@/content/types";
import { useLearnerState } from "@/lib/state/hooks";
import { seededShuffle } from "@/lib/util/random";
import { cn } from "@/lib/util/cn";
import { ExerciseHeading } from "./ExerciseHeading";
import type { ExerciseViewProps } from "./types";

type Side = "es" | "en";
const FLASH_MS = 550;

export function Matching({ exercise, onRespond, evaluation }: ExerciseViewProps<MatchingExercise>) {
  const items = useMemo(() => exercise.pairs.map((p, i) => ({ ...p, i })), [exercise.pairs]);
  const columns = useMemo(
    () => ({ es: seededShuffle(items, `${exercise.id}:es`), en: seededShuffle(items, `${exercise.id}:en`) }),
    [items, exercise.id],
  );
  const [matched, setMatched] = useState<ReadonlySet<number>>(new Set());
  const [picked, setPicked] = useState<{ side: Side; i: number } | null>(null);
  const [flash, setFlash] = useState<{ es: number; en: number } | null>(null);
  const mistakes = useRef(0);
  const missed = useRef(new Set<string>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { play } = useAudio();
  const autoPlay = useLearnerState()?.settings.autoPlayAudio ?? true;
  const locked = evaluation !== null;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function choose(side: Side, i: number) {
    if (locked || matched.has(i) || flash) return;
    if (side === "es" && autoPlay) void play({ text: items[i].es }, "normal");

    if (!picked || picked.side === side) {
      setPicked({ side, i });
      return;
    }
    const esIndex = side === "es" ? i : picked.i;
    const enIndex = side === "en" ? i : picked.i;
    setPicked(null);

    if (esIndex === enIndex) {
      const next = new Set(matched).add(esIndex);
      setMatched(next);
      if (next.size === items.length) {
        onRespond({ kind: "pairs", mistakes: mistakes.current, missedVocabIds: [...missed.current] }, { submit: true });
      }
    } else {
      mistakes.current += 1;
      const id = items[esIndex].vocabId;
      if (id) missed.current.add(id);
      setFlash({ es: esIndex, en: enIndex });
      timer.current = setTimeout(() => setFlash(null), FLASH_MS);
    }
  }

  const stateOf = (side: Side, i: number) => {
    if (matched.has(i)) return "matched";
    if (flash && flash[side] === i) return "wrong";
    if (picked && picked.side === side && picked.i === i) return "picked";
    return "idle";
  };

  return (
    <div>
      <ExerciseHeading eyebrow="Match the pairs" title={exercise.prompt ?? "Tap a Spanish word, then its meaning"} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {(["es", "en"] as const).map((side) => (
          <ul key={side} className="space-y-3" aria-label={side === "es" ? "Spanish" : "English"}>
            {columns[side].map((item) => {
              const state = stateOf(side, item.i);
              return (
                <li key={item.i}>
                  <button
                    type="button"
                    lang={side}
                    disabled={state === "matched" || locked}
                    aria-pressed={state === "picked"}
                    onClick={() => choose(side, item.i)}
                    className={cn(
                      "tactile flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-center font-bold shadow-[0_3px_0_var(--line-strong)] [--edge:var(--line-strong)]",
                      side === "es" ? "font-display text-xl" : "text-[17px]",
                      state === "idle" && "border-line bg-surface hover:bg-surface-2",
                      state === "picked" && "border-teal-500 bg-soft-teal text-on-teal shadow-[0_3px_0_var(--color-teal-500)]",
                      state === "wrong" && "animate-shake border-chili-500 bg-soft-chili text-on-chili shadow-[0_3px_0_var(--color-chili-500)]",
                      state === "matched" && "border-transparent bg-soft-leaf text-on-leaf shadow-none",
                    )}
                  >
                    {state === "matched" && <Check size={18} strokeWidth={3} aria-hidden="true" />}
                    {side === "es" ? item.es : item.en}
                    {state === "matched" && <span className="sr-only"> — matched</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
      <p className="mt-5 text-center text-sm text-muted" aria-live="polite">{matched.size} of {items.length} matched</p>
    </div>
  );
}
