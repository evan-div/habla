"use client";

import { BookCheck, BookOpen, Brain, Clock, Flame, GraduationCap, Medal, Target, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { ColumnChart, type Column } from "@/components/charts/ColumnChart";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { LineChart, type LinePoint } from "@/components/charts/LineChart";
import { MasteryBar } from "@/components/charts/MasteryBar";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { Card, SectionHeading } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { MasteryMeter } from "@/components/vocabulary/MasteryMeter";
import { availableGrammar, getGrammar } from "@/content/grammar";
import { levelInfo } from "@/lib/gamification/levels";
import { useLearner } from "@/lib/state/hooks";
import {
  achievementsOf, activityOn, grammarMastery, learnedWords, lessonsCompletedCount, overallAccuracy, reviewAccuracy,
  streakOf, totalLearningSeconds, weakGrammar,
} from "@/lib/state/selectors";
import { dateKey, formatDuration, lastNDayKeys, parseDateKey, weekKeys } from "@/lib/util/dates";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const longDay = (key: string) => new Date(parseDateKey(key)).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
const shortDay = (key: string) => new Date(parseDateKey(key)).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function ProgressDashboard() {
  const learner = useLearner();

  const data = useMemo(() => {
    if (!learner) return null;
    const { state, now } = learner;
    const today = dateKey(now);
    const words = learnedWords(state, now);

    const week: Column[] = weekKeys(today).map((key, i) => ({
      label: DOW[i], detail: longDay(key), value: activityOn(state, key).xp, highlight: key === today,
    }));

    // Cumulative vocabulary over the last 30 days, from when each word was first met.
    const days = lastNDayKeys(today, 30);
    const metOn = words.map((w) => dateKey(w.progress.createdAt));
    const growth: LinePoint[] = days.map((key) => ({ label: shortDay(key), detail: longDay(key), value: metOn.filter((d) => d <= key).length }));

    const accDays = lastNDayKeys(today, 14);
    const accuracy: LinePoint[] = accDays.map((key) => {
      const a = activityOn(state, key);
      const total = a.correct + a.incorrect;
      return { label: shortDay(key), detail: longDay(key), value: total === 0 ? null : Math.round((a.correct / total) * 100) };
    });

    const counts = { weak: 0, learning: 0, strong: 0 };
    for (const w of words) counts[w.band]++;
    const weakest = words.filter((w) => w.band === "weak" && w.progress.timesSeen >= 2).sort((a, b) => a.mastery - b.mastery).slice(0, 5);

    return { state, now, words, week, growth, accuracy, counts, weakest, streak: streakOf(state, now) };
  }, [learner]);

  if (!learner || !data) {
    return (
      <PageContainer>
        <Skeleton className="mb-6 h-12 w-64" />
        <Skeleton className="mb-5 h-40" />
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
      </PageContainer>
    );
  }

  const { state, now, words, week, growth, accuracy, counts, weakest, streak } = data;
  const level = levelInfo(state.totalXp);
  const acc = overallAccuracy(state);
  const revAcc = reviewAccuracy(state);
  const weekXp = week.reduce((s, c) => s + c.value, 0);
  const grammarList = availableGrammar();
  const weakConcepts = weakGrammar(state);
  const achievements = achievementsOf(state, now);
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const mastered = counts.strong;
  const hasActivity = state.totalXp > 0;

  return (
    <PageContainer>
      <PageHeader title="Progress" subtitle="Everything you've learned, and how well it's sticking." />

      <Card tone="violet" padding="lg" className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        <LevelBadge level={level.level} size={72} />
        <div className="min-w-0 flex-1" style={{ minWidth: "14rem" }}>
          <p className="text-sm font-extrabold uppercase tracking-widest text-on-violet">Level {level.level} · {level.title}</p>
          <p className="font-display text-6xl font-extrabold leading-none tracking-tight">
            {state.totalXp.toLocaleString()}<span className="ml-2 text-2xl text-muted">XP</span>
          </p>
          <ProgressBar value={level.progress * 100} tone="violet" label={`Progress to level ${level.level + 1}`} className="mt-3 max-w-md" />
          <p className="mt-1.5 text-sm text-muted">{level.xpForLevel - level.xpIntoLevel} XP to {level.nextTitle} (level {level.level + 1})</p>
        </div>
      </Card>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3" role="group" aria-label="Key numbers">
        <StatCard label="Current streak" value={`${streak.current} ${streak.current === 1 ? "day" : "days"}`} hint={streak.needsPracticeToday ? "Practice today to extend it" : undefined} icon={<Flame size={22} className="text-rosa-500" />} tone="rosa" />
        <StatCard label="Longest streak" value={`${streak.longest} ${streak.longest === 1 ? "day" : "days"}`} hint="One rest day a week is built in" icon={<Medal size={22} className="text-sol-600" />} tone="sol" />
        <StatCard label="Lessons completed" value={lessonsCompletedCount(state)} icon={<Trophy size={22} className="text-teal-600" />} tone="teal" />
        <StatCard label="Vocabulary learned" value={words.length} icon={<BookOpen size={22} className="text-teal-600" />} tone="teal" />
        <StatCard label="Vocabulary mastered" value={mastered} hint="Strong mastery (80%+)" icon={<BookCheck size={22} className="text-leaf-600" />} tone="leaf" />
        <StatCard label="Grammar concepts" value={Object.keys(state.grammar).length} hint={`of ${grammarList.length} available`} icon={<GraduationCap size={22} className="text-violet-500" />} tone="violet" />
        <StatCard label="Review accuracy" value={revAcc === null ? "—" : `${Math.round(revAcc * 100)}%`} hint={state.counters.reviewCardsCompleted > 0 ? `${state.counters.reviewCardsCompleted} cards reviewed` : "No reviews yet"} icon={<Target size={22} className="text-rosa-500" />} tone="rosa" />
        <StatCard label="Overall accuracy" value={acc === null ? "—" : `${Math.round(acc * 100)}%`} hint="All first tries" icon={<Zap size={22} className="text-sol-600" />} tone="sol" />
        <StatCard label="Learning time" value={formatDuration(totalLearningSeconds(state))} icon={<Clock size={22} className="text-violet-500" />} tone="violet" />
      </div>

      {hasActivity ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartFrame
            title="XP this week"
            subtitle="Monday to Sunday"
            summary={<p className="text-right text-sm font-bold"><span className="font-display text-2xl font-extrabold">{weekXp}</span> XP</p>}
            table={{ headers: ["Day", "XP"], rows: week.map((c) => [c.detail, c.value]) }}
          >
            <ColumnChart columns={week} unit="XP" goal={state.profile.dailyGoalXp} goalLabel="Goal" ariaLabel="XP earned each day this week" />
          </ChartFrame>

          <ChartFrame
            title="Vocabulary growth"
            subtitle="Words you've met, last 30 days"
            summary={<p className="text-right text-sm font-bold"><span className="font-display text-2xl font-extrabold">{words.length}</span> words</p>}
            table={{ headers: ["Day", "Words met"], rows: growth.map((p) => [p.detail, p.value ?? 0]) }}
          >
            <LineChart points={growth} color="var(--color-teal-500)" unit="words" area ariaLabel="Total vocabulary over the last 30 days" />
          </ChartFrame>

          <ChartFrame
            title="Mastery"
            subtitle="How well each word is sticking"
            table={{ headers: ["Level", "Words", "Mastery range"], rows: [["Weak", counts.weak, "under 40%"], ["Learning", counts.learning, "40–79%"], ["Strong", counts.strong, "80%+"]] }}
          >
            <MasteryBar
              segments={[
                { key: "weak", label: "Weak", count: counts.weak, className: "bg-band-weak", range: "under 40%" },
                { key: "learning", label: "Learning", count: counts.learning, className: "bg-band-learning", range: "40–79%" },
                { key: "strong", label: "Strong", count: counts.strong, className: "bg-band-strong", range: "80%+" },
              ]}
            />
          </ChartFrame>

          <ChartFrame
            title="Accuracy over time"
            subtitle="First-try accuracy, last 14 days"
            table={{ headers: ["Day", "Accuracy"], rows: accuracy.map((p) => [p.detail, p.value === null ? "—" : `${p.value}%`]) }}
          >
            <LineChart points={accuracy} color="var(--color-rosa-500)" unit="% correct" yMax={100} format={(v) => `${v}%`} ariaLabel="First-try accuracy over the last 14 days" />
          </ChartFrame>
        </div>
      ) : (
        <Card tone="default" padding="lg" className="text-center">
          <p className="text-xl font-extrabold">Your charts will fill in as you learn</p>
          <p className="mx-auto mt-1 max-w-md text-muted">Finish a lesson and you&apos;ll see weekly XP, vocabulary growth, mastery and accuracy right here.</p>
        </Card>
      )}

      <section className="mt-10" aria-labelledby="focus-heading">
        <SectionHeading id="focus-heading" title="Where to focus" />
        {weakConcepts.length === 0 && weakest.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-line p-5 text-muted">Nothing is giving you trouble yet. As you practice, the grammar topics and words you keep missing will be flagged here.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {weakConcepts.length > 0 && (
              <Card padding="md">
                <h3 className="mb-2 flex items-center gap-2 font-extrabold"><Brain size={18} className="text-violet-500" aria-hidden="true" /> Grammar to revisit</h3>
                <ul className="space-y-2">
                  {weakConcepts.map((g) => (
                    <li key={g.grammarId}>
                      <Link href={`/grammar/${g.grammarId}`} className="flex items-center justify-between rounded-xl bg-soft-violet px-3 py-2 font-bold text-on-violet hover:brightness-95">
                        {getGrammar(g.grammarId)?.title ?? g.grammarId}
                        <span className="text-sm">{Math.round(g.accuracy * 100)}% right</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {weakest.length > 0 && (
              <Card padding="md">
                <h3 className="mb-2 flex items-center gap-2 font-extrabold"><Target size={18} className="text-rosa-500" aria-hidden="true" /> Weakest words</h3>
                <ul className="space-y-2">
                  {weakest.map((w) => (
                    <li key={w.vocab.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3 py-2">
                      <span className="font-extrabold">{w.vocab.spanish} <span className="font-semibold text-muted">· {w.vocab.english}</span></span>
                      <MasteryMeter score={w.mastery} showValue={false} segments={5} />
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="grammar-heading">
        <SectionHeading id="grammar-heading" title="Grammar concepts" action={<Link href="/grammar" className="font-bold text-on-teal underline underline-offset-4">Grammar reference</Link>} />
        <Card padding="sm">
          <ul className="divide-y-2 divide-line">
            {grammarList.map((g) => {
              const p = state.grammar[g.id];
              const m = grammarMastery(p);
              return (
                <li key={g.id}>
                  <Link href={`/grammar/${g.id}`} className="flex items-center gap-4 rounded-xl px-3 py-2.5 hover:bg-surface-2">
                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold">{g.title}</span>
                      <span className="block truncate text-sm text-muted">{g.tagline}</span>
                    </span>
                    {p ? (
                      <span className="flex w-36 shrink-0 flex-col items-end gap-1">
                        <ProgressBar value={m} size="sm" tone={m >= 80 ? "leaf" : "brand"} label={`${g.title} mastery`} />
                        <span className="text-xs font-bold text-muted">{p.attempts === 0 ? "Learned" : `${m}% mastery`}</span>
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-muted">Not met yet</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      <section className="mt-10" aria-labelledby="ach-heading">
        <SectionHeading id="ach-heading" title="Achievements" action={<span className="font-bold text-muted">{unlocked} / {achievements.length} unlocked</span>} />
        <div className="grid gap-3 md:grid-cols-2">
          {[...achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked)).map(({ def, progress, unlocked: done }) => (
            <AchievementCard key={def.id} title={def.title} description={def.description} icon={def.icon} tone={def.tone} unlocked={done} progress={progress} target={def.target} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
