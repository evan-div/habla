"use client";

import type { RefObject } from "react";
import { cn } from "@/lib/util/cn";

const ACCENTS = ["á", "é", "í", "ó", "ú", "ñ"] as const;

interface ConjugationInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  /** null while answering; then whether the answer was right. */
  verdict: boolean | null;
  label: string;
}

/**
 * Answer field that stays mounted and focused between prompts (read-only while
 * feedback shows), so a phone keyboard never drops mid-round.
 */
export function ConjugationInput({ inputRef, value, onChange, verdict, label }: ConjugationInputProps) {
  const locked = verdict !== null;

  function insert(ch: string) {
    const el = inputRef.current;
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
    <div className="mx-auto w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly={locked}
        aria-label={label}
        placeholder="Type the form…"
        lang="es"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint={locked ? "next" : "done"}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-16 w-full rounded-2xl border-2 px-4 text-center font-display text-3xl font-bold outline-none transition-colors placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-faint",
          // One set per state: cn doesn't dedupe, so competing bg/border classes would fight.
          verdict === null && "border-line-strong bg-surface focus:border-teal-500",
          verdict === true && "border-leaf-500 bg-soft-leaf text-on-leaf",
          verdict === false && "animate-shake border-chili-500 bg-soft-chili text-on-chili",
        )}
      />
      <div className="mt-3 flex justify-center gap-1.5" role="group" aria-label="Spanish characters">
        {ACCENTS.map((ch) => (
          <button
            key={ch}
            type="button"
            tabIndex={-1}
            disabled={locked}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => insert(ch)}
            aria-label={`Insert ${ch}`}
            className="grid h-10 min-w-10 place-items-center rounded-xl border-2 border-line bg-surface px-2 text-lg font-bold hover:bg-surface-2 disabled:opacity-40"
          >
            {ch}
          </button>
        ))}
      </div>
    </div>
  );
}
