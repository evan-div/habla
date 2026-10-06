"use client";

import { ChevronDown, Flame, Sparkles, Target, TrendingUp, Trophy } from "lucide-react";
import { Mascot } from "@/components/brand/Mascot";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getUnit } from "@/content/course";
import { getVocab } from "@/content/vocabulary";
import { getAchievement } from "@/lib/gamification/achievements";
import { levelTitle } from "@/lib/gamification/levels";
import type { SessionSummary } from "@/lib/state/types";
import { useCountUp } from "@/lib/util/useCountUp";
import { cn } from "@/lib/util/cn";
import { Confetti } from "./Confetti";

interface SessionCompleteProps {
  summary: SessionSummary;
  title: string;
  continueHref: string;
  continueLabel?: string;
}

const HEADLINE = { lesson: "Lesson complete", review: "Review complete", practice: "Practice complete" } as const;

function WordChips({ ids, tone }: { ids: string[]; tone: "teal" | "sol" }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {ids.map((id) => {
        const v = getVocab(id);
        if (!v) return null;
        return (
          <li key={id} className={cn("rounded-xl px-3 py-1.5 text-sm", tone === "teal" ? "bg-soft-teal text-on-teal" : "bg-soft-sol text-on-sol")}>
            <span className="font-extrabold">{v.spanish}</span> <span className="opacity-80">· {v.english}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function SessionComplete({ summary, title, continueHref, continueLabel = "Continue" }: SessionCompleteProps) {
  const xp = useCountUp(summary.xpTotal);
  const accuracyPct = summary.accuracy === null ? null : Math.round(summary.accuracy * 100);
  const leveledUp = summary.level.after > summary.level.before;
  const unit = summary.completedUnitId ? getUnit(summary.completedUnitId) : undefined;
  const achievements = summary.newAchievementIds.map(getAchievement).filter((a) => a !== undefined);
  const strongTone = accuracyPct !== null && accuracyPct >= 90;

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Confetti seed={summary.xpTotal + 3} />
      <div className="relative mx-auto w-full max-w-2xl px-4 pb-16 pt-10 text-center sm:pt-14">
        <div className="animate-pop"><Mascot mood="cheer" size={150} animated className="mx-auto" /></div>

        <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.25em] text-on-teal animate-rise">{HEADLINE[summary.kind]}</p>
        <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl animate-rise [animation-delay:60ms]">{title}</h1>

        <div className="mt-6 animate-rise [animation-delay:140ms]" aria-label={`${summary.xpTotal} XP earned`}>
          <span className="inline-flex items-baseline gap-2 rounded-3xl bg-sol-300 px-7 py-3 font-display text-6xl font-extrabold tabular-nums text-[#4a3300] shadow-[0_5px_0_var(--color-sol-500)]">
            +{xp}<span className="text-2xl">XP</span>
          </span>
          <ul className="mx-auto mt-4 max-w-xs space-y-1 text-left text-sm text-muted">
            {summary.xpLines.map((l) => (
              <li key={l.label} className="flex justify-between gap-4"><span>{l.label}</span><span className="font-bold text-ink">+{l.xp}</span></li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Card padding="sm" tone={strongTone ? "leaf" : "teal"} className="animate-rise [animation-delay:240ms]">
            <p className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted"><Target size={14} aria-hidden="true" /> Accuracy</p>
            <p className="font-display text-4xl font-extrabold">{accuracyPct === null ? "—" : `${accuracyPct}%`}</p>
            <p className="text-sm text-muted">{summary.correctCount} of {summary.totalCount} first tries</p>
          </Card>
          <Card padding="sm" tone="rosa" className="animate-rise [animation-delay:320ms]">
            <p className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted"><Flame size={14} aria-hidden="true" /> Streak</p>
            <p className="font-display text-4xl font-extrabold">🔥 {summary.streak.current}<span className="text-xl"> {summary.streak.current === 1 ? "day" : "days"}</span></p>
            <p className="text-sm text-muted">{summary.streak.increased ? "Streak extended!" : summary.streak.current > 0 ? "Keep it rolling" : "Come back tomorrow"}</p>
          </Card>
          <Card padding="sm" tone="sol" className="animate-rise [animation-delay:400ms]">
            <p className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted"><TrendingUp size={14} aria-hidden="true" /> Words</p>
            <p className="text-lg font-extrabold leading-snug">
              <span className="block">{summary.newWordIds.length} new {summary.newWordIds.length === 1 ? "word" : "words"} learned</span>
              <span className="block">{summary.strengthenedWordIds.length} {summary.strengthenedWordIds.length === 1 ? "word" : "words"} strengthened</span>
            </p>
          </Card>
        </div>

        {leveledUp && (
          <Card tone="violet" padding="sm" className="mt-4 flex items-center justify-center gap-4 animate-pop">
            <LevelBadge level={summary.level.after} size={56} />
            <div className="text-left">
              <p className="text-xs font-extrabold uppercase tracking-widest text-on-violet">Level up!</p>
              <p className="font-display text-2xl font-extrabold">Level {summary.level.after} · {levelTitle(summary.level.after)}</p>
            </div>
          </Card>
        )}

        {summary.dailyGoal.justReached && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-soft-leaf px-4 py-2 font-extrabold text-on-leaf animate-pop">
            <Trophy size={18} aria-hidden="true" /> Daily goal reached — {summary.dailyGoal.target} XP!
          </p>
        )}

        {unit && (
          <Card tone="leaf" padding="sm" className="mt-4 animate-pop">
            <p className="text-xs font-extrabold uppercase tracking-widest text-on-leaf">Unit complete</p>
            <p className="font-display text-2xl font-extrabold">Unit {unit.number}: {unit.title}</p>
          </Card>
        )}

        {achievements.length > 0 && (
          <section className="mt-6 text-left" aria-label="Achievements unlocked">
            <h2 className="mb-2 flex items-center gap-2 text-center text-sm font-extrabold uppercase tracking-widest text-muted"><Sparkles size={16} className="text-sol-500" aria-hidden="true" /> Achievement unlocked</h2>
            <div className="space-y-2.5">
              {achievements.map((a) => (
                <AchievementCard key={a.id} title={a.title} description={a.description} icon={a.icon} tone={a.tone} unlocked progress={a.target} target={a.target} className="animate-pop" />
              ))}
            </div>
          </section>
        )}

        {(summary.newWordIds.length > 0 || summary.strengthenedWordIds.length > 0) && (
          <section className="mt-8 space-y-5 text-left">
            {summary.newWordIds.length > 0 && (
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-muted">New words</h2>
                <WordChips ids={summary.newWordIds} tone="teal" />
              </div>
            )}
            {summary.strengthenedWordIds.length > 0 && (
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-muted">Strengthened</h2>
                <WordChips ids={summary.strengthenedWordIds} tone="sol" />
              </div>
            )}
          </section>
        )}

        {summary.mistakes.length > 0 && (
          <details className="group mt-8 rounded-3xl border-2 border-line bg-surface text-left shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-extrabold [&::-webkit-details-marker]:hidden">
              <span>Review your mistakes ({summary.mistakes.length})</span>
              <ChevronDown size={22} className="transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="space-y-3 px-4 pb-4">
              {summary.mistakes.map((m) => (
                <li key={m.exerciseId} className="rounded-2xl bg-surface-2/70 p-3.5">
                  <p className="text-sm font-bold text-muted">{m.prompt}</p>
                  <p className="mt-1 text-sm"><span className="text-muted">You wrote:</span> <span className="font-semibold line-through decoration-chili-500/70 decoration-2">{m.yourAnswer}</span></p>
                  <p><span className="text-sm text-muted">Better:</span> <span className="font-display text-lg font-extrabold text-on-leaf">{m.correctAnswer}</span></p>
                  {m.explanation && <p className="mt-1 text-sm"><span className="font-extrabold">Why? </span>{m.explanation}</p>}
                </li>
              ))}
            </ul>
          </details>
        )}

        <ButtonLink href={continueHref} size="lg" className="mt-10 w-full sm:w-auto sm:min-w-64">{continueLabel}</ButtonLink>
      </div>
    </div>
  );
}
