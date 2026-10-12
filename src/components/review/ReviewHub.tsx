"use client";

import { Brain, CalendarClock, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { DojoCard } from "@/components/dojo/DojoCard";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { Mascot } from "@/components/brand/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { MasteryMeter } from "@/components/vocabulary/MasteryMeter";
import { WordDetail } from "@/components/vocabulary/WordDetail";
import { SRS_CONFIG } from "@/config/srs";
import { reviewForecast } from "@/lib/srs/queue";
import { useLearner } from "@/lib/state/hooks";
import { learnedWords, reviewAccuracy, reviewStats } from "@/lib/state/selectors";
import { DAY, formatDue } from "@/lib/util/dates";

/** Local end-of-day timestamp for `now` + `plusDays`. */
function endOfDay(now: number, plusDays: number): number {
  const d = new Date(now + plusDays * DAY);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function ReviewHub() {
  const learner = useLearner();
  const [selected, setSelected] = useState<string | null>(null);

  const data = useMemo(() => {
    if (!learner) return null;
    const { state, now } = learner;
    const words = learnedWords(state, now);
    const stats = reviewStats(words, now);
    const forecast = reviewForecast(words.map((w) => w.progress), now, endOfDay(now, 0), endOfDay(now, 1));
    const upNext = words.filter((w) => w.due).sort((a, b) => a.mastery - b.mastery).slice(0, 6);
    const nextDue = words.filter((w) => !w.due).reduce<number | null>((min, w) => (min === null || w.progress.nextReview < min ? w.progress.nextReview : min), null);
    return { words, stats, forecast, upNext, nextDue };
  }, [learner]);

  if (!learner || !data) {
    return (
      <PageContainer>
        <Skeleton className="mb-6 h-12 w-64" />
        <Skeleton className="h-64" />
      </PageContainer>
    );
  }

  const { state, now } = learner;
  const { words, stats, forecast, upNext, nextDue } = data;
  const sessionCount = Math.min(stats.due, SRS_CONFIG.maxSessionSize);
  const minutes = Math.max(1, Math.round(sessionCount * 0.4));
  const accuracy = reviewAccuracy(state);

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title="Review" subtitle="Words come back right before you'd forget them — that's how they stick for good." />

      <Card tone={stats.due > 0 ? "rosa" : "teal"} padding="lg" className="relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          {words.length === 0 ? (
            <>
              <h2 className="text-3xl font-extrabold">Nothing to review yet</h2>
              <p className="mt-2 text-muted">Finish a lesson and the words you meet will be scheduled for review automatically.</p>
              <ButtonLink href="/course" size="lg" className="mt-5">Go to the course</ButtonLink>
            </>
          ) : stats.due > 0 ? (
            <>
              <p className="text-sm font-extrabold uppercase tracking-widest text-on-rosa">Ready now</p>
              <h2 className="font-display text-4xl font-extrabold uppercase leading-tight sm:text-5xl">
                {stats.due} {stats.due === 1 ? "word" : "words"} ready for review
              </h2>
              <p className="mt-2 text-muted">
                A mixed session of about {sessionCount} {sessionCount === 1 ? "card" : "cards"} · ~{minutes} min
                {stats.due > SRS_CONFIG.maxSessionSize && ` (the rest will wait for next time)`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
                {stats.weakDue > 0 && <span className="rounded-full bg-surface px-3 py-1">{stats.weakDue} weak</span>}
                {stats.recentlyMissed > 0 && <span className="rounded-full bg-surface px-3 py-1">{stats.recentlyMissed} missed recently</span>}
                {stats.newWords > 0 && <span className="rounded-full bg-surface px-3 py-1">{stats.newWords} new</span>}
              </div>
              <ButtonLink href="/review/session" size="lg" className="mt-6">Start review</ButtonLink>
            </>
          ) : (
            <>
              <p className="text-sm font-extrabold uppercase tracking-widest text-on-teal">All caught up</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Nothing is due right now</h2>
              <p className="mt-2 text-muted">{nextDue ? `Your next words are due ${formatDue(nextDue, now).toLowerCase()}.` : "Come back after your next lesson."} Want extra practice? Work on your {Math.min(SRS_CONFIG.practiceSize, words.length)} weakest words.</p>
              <ButtonLink href="/review/practice" size="lg" className="mt-6" leadingIcon={<Sparkles size={20} aria-hidden="true" />}>Practice weak words</ButtonLink>
            </>
          )}
        </div>
        <Mascot mood={stats.due > 0 ? "thinking" : "cheer"} size={150} animated className="absolute -bottom-2 right-4 hidden sm:block" />
      </Card>

      <DojoCard state={state} className="mt-6" />

      {words.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-label="Upcoming reviews">
            <StatCard label="Due now" value={forecast.dueNow} icon={<Brain size={22} className="text-rosa-500" />} tone="rosa" />
            <StatCard label="Later today" value={forecast.dueToday} icon={<CalendarClock size={22} className="text-sol-600" />} tone="sol" />
            <StatCard label="Tomorrow" value={forecast.tomorrow} icon={<CalendarClock size={22} className="text-teal-600" />} tone="teal" />
            <StatCard label="Next 5 days" value={forecast.thisWeek} icon={<CalendarClock size={22} className="text-violet-500" />} tone="violet" />
          </div>

          {upNext.length > 0 && (
            <section className="mt-8" aria-labelledby="upnext">
              <SectionHeading id="upnext" title="Needs the most attention" />
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {upNext.map((w) => (
                  <li key={w.vocab.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(w.vocab.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-line bg-surface px-4 py-3 text-left shadow-card hover:bg-surface-2"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg font-extrabold">{w.vocab.spanish}</span>
                        <span className="block text-xs font-semibold text-muted">{w.progress.timesIncorrect} missed · seen {w.progress.timesSeen}×</span>
                      </span>
                      <MasteryMeter score={w.mastery} showValue={false} segments={6} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Review history">
            <StatCard label="Review sessions" value={state.counters.reviewSessions} />
            <StatCard label="Cards reviewed" value={state.counters.reviewCardsCompleted} />
            <StatCard label="Review accuracy" value={accuracy === null ? "—" : `${Math.round(accuracy * 100)}%`} />
          </section>
        </>
      )}

      <WordDetail vocabId={selected} progress={selected ? state.words[selected] : undefined} now={now} onClose={() => setSelected(null)} />
    </PageContainer>
  );
}
