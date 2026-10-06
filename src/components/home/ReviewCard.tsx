import { Repeat } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { LearnedWord, ReviewStats } from "@/lib/state/selectors";
import { formatDue } from "@/lib/util/dates";

interface ReviewCardProps {
  stats: ReviewStats;
  words: LearnedWord[];
  now: number;
}

export function ReviewCard({ stats, words, now }: ReviewCardProps) {
  const nextDue = words.filter((w) => !w.due).reduce<number | null>((min, w) => (min === null || w.progress.nextReview < min ? w.progress.nextReview : min), null);
  const preview = words
    .filter((w) => w.due)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 4);

  return (
    <Card tone={stats.due > 0 ? "rosa" : "default"} padding="md" className="flex h-full flex-col">
      <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-muted">
        <Repeat size={16} aria-hidden="true" /> Review
      </h2>
      {words.length === 0 ? (
        <p className="mt-3 flex-1 text-muted">Words you learn are scheduled for review automatically. Finish your first lesson and they&apos;ll show up here.</p>
      ) : stats.due > 0 ? (
        <>
          <p className="mt-2 font-display text-5xl font-extrabold text-ink">{stats.due}</p>
          <p className="font-bold">{stats.due === 1 ? "word" : "words"} ready for review</p>
          <ul className="mt-3 flex flex-1 flex-wrap content-start gap-1.5" aria-label="Some of the words waiting">
            {preview.map((w) => (
              <li key={w.vocab.id} className="rounded-full bg-surface px-3 py-1 text-sm font-bold">{w.vocab.spanish}</li>
            ))}
            {stats.due > preview.length && <li className="px-1 py-1 text-sm font-semibold text-muted">+{stats.due - preview.length} more</li>}
          </ul>
          <ButtonLink href="/review/session" size="md" className="mt-4" fullWidth>Start review</ButtonLink>
        </>
      ) : (
        <>
          <p className="mt-2 text-xl font-extrabold">You&apos;re all caught up</p>
          <p className="mt-1 flex-1 text-muted">{nextDue ? `Next words are due ${formatDue(nextDue, now).toLowerCase()}.` : "Nothing is scheduled yet."}</p>
          <ButtonLink href="/review" variant="secondary" size="md" className="mt-4" fullWidth>Practice anyway</ButtonLink>
        </>
      )}
    </Card>
  );
}
