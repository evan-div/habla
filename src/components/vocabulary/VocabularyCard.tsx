"use client";

import { AudioButton } from "@/components/audio/AudioButton";
import { Badge } from "@/components/ui/Badge";
import { vocabClip } from "@/content/vocabulary";
import type { LearnedWord } from "@/lib/state/selectors";
import { formatRelative } from "@/lib/util/dates";
import { cn } from "@/lib/util/cn";
import { MasteryMeter } from "./MasteryMeter";
import { WordTags } from "./WordTags";

interface VocabularyCardProps {
  word: LearnedWord;
  now: number;
  onSelect?: (vocabId: string) => void;
  /** Compact variant for dashboards. */
  compact?: boolean;
}

export function VocabularyCard({ word, now, onSelect, compact = false }: VocabularyCardProps) {
  const { vocab, progress, mastery, due } = word;
  const display = vocab.feminine ? `${vocab.spanish} / ${vocab.feminine}` : vocab.spanish;

  return (
    <article className="relative flex items-stretch overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-card transition-transform hover:-translate-y-0.5 focus-within:-translate-y-0.5">
      <button
        type="button"
        onClick={() => onSelect?.(vocab.id)}
        aria-label={`${display}: ${vocab.english}. Mastery ${mastery}%. Open details`}
        className={cn("min-w-0 flex-1 rounded-l-2xl text-left", compact ? "px-4 py-3" : "px-4 py-3.5 sm:px-5")}
      >
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-xl font-extrabold leading-tight text-ink">{display}</span>
          {due && <Badge tone="rosa">Due</Badge>}
        </span>
        <span className="mt-0.5 block text-[15px] text-muted">{vocab.english}</span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          <WordTags vocab={vocab} />
        </span>
        <span className={cn("mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1")}>
          <MasteryMeter score={mastery} />
          {!compact && <span className="text-xs font-semibold text-muted">Last reviewed: {formatRelative(progress.lastReviewed, now)}</span>}
        </span>
      </button>
      <div className="flex items-start p-3">
        <AudioButton clip={vocabClip(vocab)} size="sm" label={`Hear ${vocab.spanish}`} />
      </div>
    </article>
  );
}
