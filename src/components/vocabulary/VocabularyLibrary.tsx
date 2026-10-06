"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { INTRODUCED_IN } from "@/content/course";
import { stripAccents } from "@/lib/engine/normalize";
import { useLearner } from "@/lib/state/hooks";
import { learnedWords, type LearnedWord } from "@/lib/state/selectors";
import { cn } from "@/lib/util/cn";
import { VocabularyCard } from "./VocabularyCard";
import { WordDetail } from "./WordDetail";

type Filter = "all" | "learning" | "strong" | "weak" | "due" | "noun" | "verb" | "adjective" | "expression";
type Sort = "recent" | "weakest" | "strongest" | "alpha" | "due";

const FILTERS: Array<{ id: Filter; label: string; test: (w: LearnedWord) => boolean }> = [
  { id: "all", label: "All", test: () => true },
  { id: "learning", label: "Learning", test: (w) => w.band === "learning" },
  { id: "strong", label: "Strong", test: (w) => w.band === "strong" },
  { id: "weak", label: "Weak", test: (w) => w.band === "weak" },
  { id: "due", label: "Due for review", test: (w) => w.due },
  { id: "noun", label: "Nouns", test: (w) => w.vocab.partOfSpeech === "noun" },
  { id: "verb", label: "Verbs", test: (w) => w.vocab.partOfSpeech === "verb" },
  { id: "adjective", label: "Adjectives", test: (w) => w.vocab.partOfSpeech === "adjective" },
  { id: "expression", label: "Expressions", test: (w) => w.vocab.partOfSpeech === "expression" },
];

const SORTS: Array<{ id: Sort; label: string; cmp: (a: LearnedWord, b: LearnedWord) => number }> = [
  { id: "recent", label: "Recently learned", cmp: (a, b) => b.progress.createdAt - a.progress.createdAt },
  { id: "weakest", label: "Weakest first", cmp: (a, b) => a.mastery - b.mastery },
  { id: "strongest", label: "Strongest first", cmp: (a, b) => b.mastery - a.mastery },
  { id: "due", label: "Due soonest", cmp: (a, b) => a.progress.nextReview - b.progress.nextReview },
  { id: "alpha", label: "A–Z", cmp: (a, b) => stripAccents(a.vocab.spanish).localeCompare(stripAccents(b.vocab.spanish), "es") },
];

export function VocabularyLibrary() {
  const learner = useLearner();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const words = useMemo(() => (learner ? learnedWords(learner.state, learner.now) : []), [learner]);
  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, words.filter(f.test).length])) as Record<Filter, number>, [words]);

  const visible = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filter)!.test;
    const cmp = SORTS.find((s) => s.id === sort)!.cmp;
    const q = stripAccents(query.trim().toLowerCase());
    return words
      .filter(test)
      .filter((w) => !q || stripAccents(w.vocab.spanish.toLowerCase()).includes(q) || w.vocab.english.toLowerCase().includes(q))
      .sort(cmp);
  }, [words, filter, sort, query]);

  if (!learner) {
    return (
      <PageContainer>
        <Skeleton className="mb-6 h-12 w-64" />
        <div className="grid gap-3 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36" />)}</div>
      </PageContainer>
    );
  }

  const { state, now } = learner;
  const total = INTRODUCED_IN.size;

  return (
    <PageContainer>
      <PageHeader title="Vocabulary" subtitle="Every word and phrase you've met, each with its own mastery score." />

      <Card padding="sm" className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <p className="font-bold"><span className="font-display text-2xl font-extrabold">{words.length}</span> of {total} words in the course so far</p>
        <ProgressBar value={words.length} max={total} label="Vocabulary met" className="min-w-40 flex-1" />
      </Card>

      {words.length === 0 ? (
        <EmptyState
          title="Your vocabulary starts here"
          action={<ButtonLink href="/course" size="lg">Start your first lesson</ButtonLink>}
        >
          Every word you meet in a lesson is saved here — with its meaning, pronunciation, an example, and a mastery score that grows as you practice.
        </EmptyState>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="relative min-w-56 flex-1">
              <span className="sr-only">Search vocabulary</span>
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Spanish or English"
                className="h-12 w-full rounded-2xl border-2 border-line-strong bg-surface pl-11 pr-4 font-semibold outline-none placeholder:font-medium placeholder:text-faint focus:border-teal-500"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-muted">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-12 rounded-2xl border-2 border-line-strong bg-surface px-3 font-bold text-ink">
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <div role="group" aria-label="Filter words" className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors",
                  filter === f.id ? "border-transparent bg-brand text-on-brand" : "border-line bg-surface text-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                {f.label} <span className={cn("ml-1 tabular-nums", filter === f.id ? "opacity-85" : "text-faint")}>{counts[f.id]}</span>
              </button>
            ))}
          </div>

          <p className="mb-3 text-sm font-semibold text-muted" aria-live="polite">{visible.length} {visible.length === 1 ? "word" : "words"}</p>
          {visible.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-line p-8 text-center text-muted">No words match that filter. Try another one, or clear the search.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {visible.map((w) => <VocabularyCard key={w.vocab.id} word={w} now={now} onSelect={setSelected} />)}
            </div>
          )}
        </>
      )}

      <WordDetail vocabId={selected} progress={selected ? state.words[selected] : undefined} now={now} onClose={() => setSelected(null)} />
    </PageContainer>
  );
}
