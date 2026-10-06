"use client";

import { useState } from "react";
import { useTranslationSupport } from "@/lib/state/hooks";
import { cn } from "@/lib/util/cn";

interface TranslatedTextProps {
  /** English meaning. */
  en: string;
  className?: string;
  /** Force a mode regardless of the learner's setting (e.g. feedback panels). */
  alwaysShow?: boolean;
}

/**
 * Adaptive English support. Beginners see the translation; later the learner can
 * choose to reveal it on tap or only when they ask. Resets when the text changes.
 */
export function TranslatedText({ en, className, alwaysShow = false }: TranslatedTextProps) {
  const support = useTranslationSupport();
  return <TranslatedInner key={en} en={en} support={alwaysShow ? "full" : support} className={className} />;
}

function TranslatedInner({ en, support, className }: { en: string; support: "full" | "tap" | "minimal"; className?: string }) {
  const [revealed, setRevealed] = useState(false);
  if (support === "full" || revealed) return <p className={cn("text-muted", className)}>{en}</p>;
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className={cn("rounded-lg text-sm font-bold text-on-teal underline decoration-dotted underline-offset-4 hover:decoration-solid", support === "minimal" && "opacity-70", className)}
    >
      {support === "tap" ? "Show translation" : "Need help? Reveal"}
    </button>
  );
}
