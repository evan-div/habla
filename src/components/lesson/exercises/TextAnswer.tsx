"use client";

import { useEffect, useRef } from "react";
import type { Evaluation } from "@/lib/engine/evaluate";
import { cn } from "@/lib/util/cn";

const SPANISH_CHARS = ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"] as const;

interface TextAnswerProps {
  value: string;
  onChange: (value: string) => void;
  evaluation: Evaluation | null;
  /** Language the learner types in; Spanish shows the accent helper bar. */
  lang: "es" | "en";
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
}

/** Text field with a one-tap row for Spanish characters, so any keyboard can type correct Spanish. */
export function TextAnswer({ value, onChange, evaluation, lang, label, placeholder, autoFocus = true }: TextAnswerProps) {
  const ref = useRef<HTMLInputElement>(null);
  const locked = evaluation !== null;

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  function insert(ch: string) {
    const el = ref.current;
    if (!el || locked) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + ch + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  return (
    <div className="w-full">
      <input
        ref={ref}
        type="text"
        value={value}
        disabled={locked}
        aria-label={label}
        placeholder={placeholder}
        lang={lang}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-16 w-full rounded-2xl border-2 bg-surface px-4 font-display text-2xl font-bold outline-none transition-colors placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-faint focus:border-teal-500",
          !locked && "border-line-strong",
          locked && evaluation.correct && "border-leaf-500 bg-soft-leaf text-on-leaf",
          locked && !evaluation.correct && "border-chili-500 bg-soft-chili text-on-chili",
        )}
      />
      {lang === "es" && !locked && (
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Spanish characters">
          {SPANISH_CHARS.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => insert(ch)}
              aria-label={`Insert ${ch}`}
              className="grid h-10 min-w-10 place-items-center rounded-xl border-2 border-line bg-surface px-2 text-lg font-bold hover:bg-surface-2"
            >
              {ch}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
