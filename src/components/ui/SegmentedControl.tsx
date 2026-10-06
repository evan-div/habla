"use client";

import { useId, type KeyboardEvent } from "react";
import { cn } from "@/lib/util/cn";

interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly Option<T>[];
  label: string;
  className?: string;
}

/** A radio group styled as a segmented control; arrow keys move selection. */
export function SegmentedControl<T extends string>({ value, onChange, options, label, className }: SegmentedControlProps<T>) {
  const groupId = useId();

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = options[(index + delta + options.length) % options.length];
    onChange(next.value);
    document.getElementById(`${groupId}-${next.value}`)?.focus();
  }

  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex w-full rounded-2xl bg-surface-2 p-1 ring-1 ring-inset ring-line sm:w-auto", className)}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            id={`${groupId}-${opt.value}`}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-colors sm:flex-none",
              selected ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
