"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Clock, Target, Trophy } from "lucide-react";
import { DojoCard } from "@/components/dojo/DojoCard";
import { PageContainer } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeading } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { WordDetail } from "@/components/vocabulary/WordDetail";
import { useLearner } from "@/lib/state/hooks";
import { learnedWords, lessonsCompletedCount, nextLesson, overallAccuracy, reviewStats, totalLearningSeconds, unitProgress } from "@/lib/state/selectors";
import { formatDuration } from "@/lib/util/dates";
import { ContinueCard } from "./ContinueCard";
import { LevelCard } from "./LevelCard";
import { ReviewCard } from "./ReviewCard";
import { TodayCard } from "./TodayCard";

function timeGreeting(now: number): string {
  const h = new Date(now).getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function HomeDashboard() {
  const learner = useLearner();
  const [selected, setSelected] = useState<string | null>(null);

  const derived = useMemo(() => {
    if (!learner) return null;
    const { state, now } = learner;
    const words = learnedWords(state, now);
    return {
      words,
      stats: reviewStats(words, now),
      upNext: nextLesson(state),
      recent: [...words].sort((a, b) => b.progress.createdAt - a.progress.createdAt).slice(0, 6),
    };
  }, [learner]);

  if (!learner || !derived) return <HomeSkeleton />;
  const { state, now } = learner;
  const { words, stats, upNext, recent } = derived;
  const accuracy = overallAccuracy(state);
  const name = state.profile.displayName.trim();

  return (
    <PageContainer>
      <header className="mb-5">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {timeGreeting(now)}{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-1 text-muted">Here&apos;s what to do today.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContinueCard
            upNext={upNext}
            unitCompleted={upNext ? unitProgress(state, upNext.unit).completed : 0}
            isFirstLesson={lessonsCompletedCount(state) === 0}
          />
        </div>
        <TodayCard state={state} now={now} />
        <ReviewCard stats={stats} words={words} now={now} />
        <LevelCard state={state} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1" aria-label="Learning statistics" role="group">
          <StatCard label="Words learned" value={words.length} icon={<BookOpen size={22} className="text-teal-600" />} tone="teal" />
          <StatCard label="Accuracy" value={accuracy === null ? "—" : `${Math.round(accuracy * 100)}%`} icon={<Target size={22} className="text-rosa-500" />} tone="rosa" />
          <StatCard label="Lessons done" value={lessonsCompletedCount(state)} icon={<Trophy size={22} className="text-sol-600" />} tone="sol" />
          <StatCard label="Time studied" value={formatDuration(totalLearningSeconds(state))} icon={<Clock size={22} className="text-violet-500" />} tone="violet" />
        </div>
        <DojoCard state={state} className="lg:col-span-3" />
      </div>

      <section className="mt-8" aria-labelledby="recent-heading">
        <SectionHeading
          id="recent-heading"
          title="Recently learned"
          action={words.length > 0 ? <Link href="/vocabulary" className="font-bold text-on-teal underline underline-offset-4">See all {words.length} words</Link> : undefined}
        />
        {recent.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-line p-6 text-center text-muted">The words you learn will collect here, each with its own mastery score.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((w) => <VocabularyCard key={w.vocab.id} word={w} now={now} compact onSelect={setSelected} />)}
          </div>
        )}
      </section>

      <WordDetail vocabId={selected} progress={selected ? state.words[selected] : undefined} now={now} onClose={() => setSelected(null)} />
    </PageContainer>
  );
}

function HomeSkeleton() {
  return (
    <PageContainer>
      <Skeleton className="mb-5 h-12 w-72" />
      <div className="grid gap-5 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </PageContainer>
  );
}
