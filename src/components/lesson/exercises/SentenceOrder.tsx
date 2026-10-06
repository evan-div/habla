"use client";

import { useEffect, useMemo, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import type { SentenceOrderExercise } from "@/content/types";
import { buildTileBank } from "@/lib/engine/tiles";
import { cn } from "@/lib/util/cn";
import { ExerciseHeading } from "./ExerciseHeading";
import type { ExerciseViewProps } from "./types";

export function SentenceOrder({ exercise, onRespond, evaluation }: ExerciseViewProps<SentenceOrderExercise>) {
  const bank = useMemo(() => buildTileBank(exercise), [exercise]);
  const [placed, setPlaced] = useState<string[]>([]); // tile ids, in order
  const locked = evaluation !== null;
  const textOf = useMemo(() => new Map(bank.map((t) => [t.id, t.text])), [bank]);

  function update(next: string[]) {
    setPlaced(next);
    onRespond(next.length ? { kind: "tiles", value: next.map((id) => textOf.get(id)!) } : null);
  }

  // Backspace removes the last tile (when not typing in a field).
  useEffect(() => {
    if (locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && placed.length && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        update(placed.slice(0, -1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, placed]);

  const toEnglish = exercise.direction === "es-en";

  return (
    <div>
      <ExerciseHeading eyebrow="Build the sentence" title={toEnglish ? "Put these words in order — in English" : "Put these words in order — in Spanish"} />
      <div className="mb-5 flex items-center gap-4 rounded-3xl bg-soft-teal p-4 sm:p-5">
        {toEnglish && <AudioButton clip={{ text: exercise.source }} size="lg" label="Hear the sentence" />}
        <p lang={toEnglish ? "es" : "en"} className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{exercise.source}</p>
      </div>

      <div
        aria-label="Your answer"
        className={cn(
          "flex min-h-[5.5rem] flex-wrap content-start gap-2.5 rounded-3xl border-2 border-dashed bg-surface p-3",
          !locked && "border-line-strong",
          locked && evaluation.correct && "border-leaf-500 bg-soft-leaf",
          locked && !evaluation.correct && "border-chili-500 bg-soft-chili",
        )}
      >
        {placed.length === 0 && <p className="self-center px-2 text-faint">Tap words below to build the sentence</p>}
        {placed.map((id, i) => (
          <button
            key={id}
            type="button"
            disabled={locked}
            onClick={() => update(placed.filter((_, idx) => idx !== i))}
            aria-label={`${textOf.get(id)} — remove`}
            className="tactile animate-pop rounded-2xl border-2 border-line-strong bg-surface px-4 py-2.5 font-display text-xl font-bold shadow-[0_3px_0_var(--line-strong)] [--edge:var(--line-strong)] disabled:active:translate-y-0"
          >
            {textOf.get(id)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5" role="group" aria-label="Word bank">
        {bank.map((tile) => {
          const used = placed.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              disabled={used || locked}
              onClick={() => update([...placed, tile.id])}
              className={cn(
                "tactile rounded-2xl border-2 px-4 py-2.5 font-display text-xl font-bold shadow-[0_3px_0_var(--line-strong)] [--edge:var(--line-strong)]",
                used ? "border-transparent bg-surface-2 text-transparent shadow-none" : "border-line-strong bg-surface hover:bg-surface-2",
              )}
              aria-hidden={used}
            >
              {tile.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
