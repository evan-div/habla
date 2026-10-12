"use client";

import { ChevronDown, Flame, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { Mascot } from "@/components/brand/Mascot";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { PERSON_LABEL } from "@/components/grammar/ConjugationTable";
import { Confetti } from "@/components/lesson/Confetti";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BELT_TEST, getBelt, getDojoVerb, TENSE_INFO } from "@/lib/dojo/catalog";
import type { DojoSummary } from "@/lib/dojo/commit";
import type { DojoAnswer } from "@/lib/dojo/session";
import { getAchievement } from "@/lib/gamification/achievements";
import { levelTitle } from "@/lib/gamification/levels";
import { useCountUp } from "@/lib/util/useCountUp";
import { BeltIcon } from "./BeltIcon";

interface DojoCompleteProps {
  summary: DojoSummary;
  answers: readonly DojoAnswer[];
  onAgain: () => void;
}

function Headline({ summary }: { summary: DojoSummary }) {
  const score = useCountUp(summary.score);
  const belt = summary.beltId ? getBelt(summary.beltId) : undefined;

  if (summary.mode === "belt" && belt) {
    if (summary.passed) {
      return (
        <>
          <div className="animate-pop"><BeltIcon belt={belt} size={160} className="mx-auto" /></div>
          <p className="mt-3 text-sm font-extrabold uppercase tracking-[0.25em] text-on-teal animate-rise">{summary.beltEarned ? "Belt earned" : "Belt test passed"}</p>
          <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl animate-rise [animation-delay:60ms]">¡{belt.spanish}!</h1>
          <p className="mt-2 text-lg text-muted animate-rise [animation-delay:100ms]">
            {belt.name} · {belt.focus}
          </p>
        </>
      );
    }
    return (
      <>
        <Mascot mood="thinking" size={130} className="mx-auto" />
        <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.25em] text-on-rosa">Belt test</p>
        <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">So close</h1>
        <p className="mx-auto mt-2 max-w-md text-lg text-muted">
          You made it through {summary.totalCount} of {BELT_TEST.length}. Three misses end a test — drill the ones below in Training, then come back for the {belt.name.toLowerCase()}.
        </p>
      </>
    );
  }

  if (summary.mode === "spar") {
    return (
      <>
        <Mascot mood="cheer" size={130} animated className="mx-auto animate-pop" />
        <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.25em] text-on-teal">Time!</p>
        <p className="mt-1 font-display text-7xl font-extrabold tabular-nums animate-rise" aria-label={`Score ${summary.score}`}>{score}</p>
        <p className="mt-1 text-lg font-bold animate-rise [animation-delay:60ms]">
          {summary.newHighScore ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-soft-sol px-4 py-1.5 text-on-sol"><Trophy size={18} aria-hidden="true" /> New high score!</span>
          ) : (
            <span className="text-muted">Your best: {summary.previousBestScore}</span>
          )}
        </p>
      </>
    );
  }

  return (
    <>
      <Mascot mood="cheer" size={130} animated className="mx-auto animate-pop" />
      <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.25em] text-on-teal">Training complete</p>
      <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">
        {summary.correctCount} of {summary.totalCount} first try
      </h1>
    </>
  );
}

export function DojoComplete({ summary, answers, onAgain }: DojoCompleteProps) {
  const xp = useCountUp(summary.xpTotal);
  const accuracyPct = summary.accuracy === null ? null : Math.round(summary.accuracy * 100);
  const leveledUp = summary.level.after > summary.level.before;
  const achievements = summary.newAchievementIds.map(getAchievement).filter((a) => a !== undefined);
  const misses = answers.filter((a) => !a.correct && !a.retry);
  const celebrate = summary.beltEarned || summary.newHighScore || (summary.mode === "train" && accuracyPct === 100);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {celebrate && <Confetti seed={summary.score + summary.correctCount + 5} />}
      <div className="relative mx-auto w-full max-w-2xl px-4 pb-16 pt-10 text-center sm:pt-14">
        <Headline summary={summary} />

        <div className="mt-6 animate-rise [animation-delay:140ms]" aria-label={`${summary.xpTotal} XP earned`}>
          <span className="inline-flex items-baseline gap-2 rounded-3xl bg-sol-300 px-7 py-3 font-display text-5xl font-extrabold tabular-nums text-[#4a3300] shadow-[0_5px_0_var(--color-sol-500)]">
            +{xp}<span className="text-2xl">XP</span>
          </span>
          {summary.xpLines.length > 0 && (
            <ul className="mx-auto mt-4 max-w-xs space-y-1 text-left text-sm text-muted">
              {summary.xpLines.map((l) => (
                <li key={l.label} className="flex justify-between gap-4"><span>{l.label}</span><span className="font-bold text-ink">+{l.xp}</span></li>
              ))}
            </ul>
          )}
          {summary.xpCapped && <p className="mx-auto mt-2 max-w-sm text-sm text-muted">That&apos;s today&apos;s Dojo XP maxed out — keep drilling, it still counts toward your weak spots.</p>}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
          <Card padding="sm" tone={accuracyPct !== null && accuracyPct >= 90 ? "leaf" : "teal"} className="animate-rise [animation-delay:240ms]">
            <p className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted"><Target size={14} aria-hidden="true" /> Accuracy</p>
            <p className="font-display text-3xl font-extrabold sm:text-4xl">{accuracyPct === null ? "—" : `${accuracyPct}%`}</p>
          </Card>
          <Card padding="sm" tone="sol" className="animate-rise [animation-delay:320ms]">
            <p className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted"><Zap size={14} aria-hidden="true" /> Best run</p>
            <p className="font-display text-3xl font-extrabold sm:text-4xl">{summary.bestCombo}</p>
          </Card>
          <Card padding="sm" tone="rosa" className="animate-rise [animation-delay:400ms]">
            <p className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted"><Flame size={14} aria-hidden="true" /> Streak</p>
            <p className="font-display text-3xl font-extrabold sm:text-4xl">{summary.streak.current}</p>
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

        {achievements.length > 0 && (
          <section className="mt-6 text-left" aria-label="Achievements unlocked">
            <h2 className="mb-2 flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-widest text-muted"><Sparkles size={16} className="text-sol-500" aria-hidden="true" /> Achievement unlocked</h2>
            <div className="space-y-2.5">
              {achievements.map((a) => (
                <AchievementCard key={a.id} title={a.title} description={a.description} icon={a.icon} tone={a.tone} unlocked progress={a.target} target={a.target} className="animate-pop" />
              ))}
            </div>
          </section>
        )}

        {misses.length > 0 && (
          <details className="group mt-8 rounded-3xl border-2 border-line bg-surface text-left shadow-card" open={summary.mode === "belt" && !summary.passed}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-extrabold [&::-webkit-details-marker]:hidden">
              <span>Forms to look at again ({misses.length})</span>
              <ChevronDown size={22} className="transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="space-y-2 px-4 pb-4">
              {misses.map((m, i) => (
                <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl bg-surface-2/70 px-3.5 py-2.5">
                  <span className="text-sm font-bold text-muted">
                    {getDojoVerb(m.verbId)?.infinitive} · {TENSE_INFO[m.tense].label} · {PERSON_LABEL[m.person]}
                  </span>
                  <span>
                    {m.given && <span className="mr-2 text-sm font-semibold line-through decoration-chili-500/70 decoration-2">{m.given}</span>}
                    <span lang="es" className="font-display text-lg font-extrabold text-on-leaf">{m.expected}</span>
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="mt-10 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <ButtonLink href="/dojo" variant="secondary" size="lg" className="sm:min-w-48">Back to the Dojo</ButtonLink>
          {!(summary.mode === "belt" && summary.passed) && (
            <Button size="lg" onClick={onAgain} className="sm:min-w-48" autoFocus>
              {summary.mode === "belt" ? "Try again" : "Go again"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
