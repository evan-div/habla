"use client";

import { Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Evaluation } from "@/lib/engine/evaluate";
import { cn } from "@/lib/util/cn";

interface ChoiceListProps {
  options: readonly string[];
  value: string | null;
  onChange: (value: string) => void;
  evaluation: Evaluation | null;
  label: string;
  /** Wrap options into a grid on wide screens (short answers). */
  grid?: boolean;
}

/** Radio-style answer list: tap, arrow keys, or number keys 1–9. */
export function ChoiceList({ options, value, onChange, evaluation, label, grid = false }: ChoiceListProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const locked = evaluation !== null;

  useEffect(() => {
    if (locked) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= options.length) {
        onChange(options[n - 1]);
        refs.current[n - 1]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, onChange, options]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (locked) return;
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + options.length) % options.length;
    onChange(options[next]);
    refs.current[next]?.focus();
  }

  const focusIndex = value ? Math.max(0, options.indexOf(value)) : 0;

  return (
    <div role="radiogroup" aria-label={label} className={cn("grid gap-3", grid && options.every((o) => o.length < 22) && "sm:grid-cols-2")}>
      {options.map((option, i) => {
        const selected = option === value;
        const isAnswer = locked && option === evaluation.correctAnswer;
        const isWrongPick = locked && selected && !evaluation.correct;
        return (
          <button
            key={option}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={i === focusIndex ? 0 : -1}
            disabled={locked}
            onClick={() => onChange(option)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "tactile flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[17px] font-bold shadow-[0_3px_0_var(--line-strong)] [--edge:var(--line-strong)]",
              "disabled:cursor-default disabled:active:translate-y-0",
              !locked && !selected && "border-line bg-surface hover:bg-surface-2",
              !locked && selected && "border-teal-500 bg-soft-teal text-on-teal shadow-[0_3px_0_var(--color-teal-500)] [--edge:var(--color-teal-500)]",
              isAnswer && "border-leaf-500 bg-soft-leaf text-on-leaf shadow-[0_3px_0_var(--color-leaf-500)]",
              isWrongPick && "animate-shake border-chili-500 bg-soft-chili text-on-chili shadow-[0_3px_0_var(--color-chili-500)]",
              locked && !isAnswer && !isWrongPick && "border-line bg-surface opacity-60 shadow-none",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 text-sm font-extrabold",
                selected || isAnswer ? "border-current" : "border-line text-muted",
              )}
              aria-hidden="true"
            >
              {isAnswer ? <Check size={18} strokeWidth={3} /> : isWrongPick ? <X size={18} strokeWidth={3} /> : i + 1}
            </span>
            <span className="min-w-0 flex-1">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
