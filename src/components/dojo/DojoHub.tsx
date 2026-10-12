"use client";

import { Dumbbell, Lock, Timer } from "lucide-react";
import { useMemo } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionHeading } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { TENSES, type Tense } from "@/lib/conjugate/conjugate";
import { BELT_TEST, TENSE_INFO, unitTeaching } from "@/lib/dojo/catalog";
import { beltStatuses, currentBelt, practicePool, unlockedTenses, weakSpots, weakSpotKey, type BeltStatus } from "@/lib/dojo/selectors";
import { updateDojoPrefs } from "@/lib/state/actions";
import { useLearner } from "@/lib/state/hooks";
import type { DojoFocus, LearnerState } from "@/lib/state/types";
import { cn } from "@/lib/util/cn";
import { BeltIcon } from "./BeltIcon";

const FOCUS_OPTIONS = [
  { value: "all", label: "All verbs" },
  { value: "tricky", label: "Tricky verbs" },
  { value: "weak", label: "Weak spots" },
] as const satisfies readonly { value: DojoFocus; label: string }[];

function RankCard({ statuses, state }: { statuses: BeltStatus[]; state: LearnerState }) {
  const current = currentBelt(state);
  const next = statuses.find((s) => s.state === "next");
  return (
    <Card padding="lg" aria-labelledby="rank-heading">
      <div className="flex items-center gap-5">
        {current ? <BeltIcon belt={current} size={96} /> : <BeltIcon belt={statuses[0].belt} size={96} muted />}
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-widest text-muted">Your rank</p>
          <h2 id="rank-heading" className="font-display text-3xl font-extrabold leading-tight">{current ? current.spanish : "No belt yet"}</h2>
          <p className="text-muted">{current ? `${current.name} · ${current.focus}` : "Pass a belt test to earn your first."}</p>
        </div>
      </div>

      <ol className="mt-6 grid grid-cols-7 gap-1 sm:gap-2" aria-label="Belts">
        {statuses.map((s) => (
          <li key={s.belt.id} className="flex flex-col items-center gap-1 text-center">
            <span className={cn("grid w-full place-items-center rounded-2xl py-1.5", s.state === "next" && "bg-soft-teal ring-2 ring-teal-500")}>
              <BeltIcon belt={s.belt} size={40} muted={s.state === "locked"} />
            </span>
            <span className="text-[10px] font-bold leading-tight text-muted sm:text-xs">{s.belt.name.replace(" belt", "")}</span>
            <span className="sr-only">{s.state === "earned" ? "earned" : s.state === "next" ? "next up" : "locked"}</span>
          </li>
        ))}
      </ol>

      {next ? (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-widest text-on-teal">Next: {next.belt.name}</p>
            <p className="font-extrabold">{next.belt.focus}</p>
            <p className="text-sm text-muted">
              {next.ready
                ? `${BELT_TEST.length} prompts, untimed. Three misses and the test is over.`
                : next.blocker?.kind === "verbs"
                  ? `Learn a few more verbs in the course first (you know ${next.blocker.have}).`
                  : `Opens once the course reaches ${next.blocker?.unit ? `Unit ${next.blocker.unit}` : "these tenses"}.`}
            </p>
          </div>
          {next.ready ? (
            <ButtonLink href="/dojo/belt" size="lg" className="shrink-0">Take the test</ButtonLink>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-muted"><Lock size={16} aria-hidden="true" /> Locked</span>
          )}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl bg-soft-sol p-4 font-extrabold text-on-sol">¡Cinta negra! Every belt is yours — sparring is where black belts keep sharp.</p>
      )}
    </Card>
  );
}

function TensePicker({ state }: { state: LearnerState }) {
  const unlocked = unlockedTenses(state);
  const chosen = state.dojo.tenses.filter((t) => unlocked.includes(t));
  const allOn = chosen.length === 0;
  const pool = practicePool(state, state.dojo.tenses, state.dojo.focus);

  function toggle(t: Tense) {
    const next = chosen.includes(t) ? chosen.filter((x) => x !== t) : [...chosen, t];
    updateDojoPrefs({ tenses: next.length === unlocked.length ? [] : next });
  }

  return (
    <Card padding="md" aria-labelledby="drill-heading">
      <h2 id="drill-heading" className="text-xl font-extrabold">What to drill</h2>
      <p className="mt-1 text-sm text-muted">For training and sparring. Tenses open as the course teaches them.</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Tenses">
        <button
          type="button"
          aria-pressed={allOn}
          onClick={() => updateDojoPrefs({ tenses: [] })}
          className={cn("rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-colors", allOn ? "border-teal-500 bg-soft-teal text-on-teal" : "border-line text-muted hover:bg-surface-2")}
        >
          Everything unlocked
        </button>
        {TENSES.map((t) => {
          const open = unlocked.includes(t);
          const on = open && chosen.includes(t);
          const unit = unitTeaching(TENSE_INFO[t].grammarId);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              disabled={!open}
              onClick={() => toggle(t)}
              title={open ? TENSE_INFO[t].example : `Opens in Unit ${unit}`}
              className={cn(
                "rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-colors",
                on ? "border-violet-500 bg-soft-violet text-on-violet" : "border-line text-ink hover:bg-surface-2",
                !open && "cursor-not-allowed border-dashed text-faint hover:bg-transparent",
              )}
            >
              {TENSE_INFO[t].label}
              {!open && <span className="ml-1.5 text-xs font-semibold">· Unit {unit}</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <SegmentedControl<DojoFocus> label="Which verbs" value={state.dojo.focus} onChange={(focus) => updateDojoPrefs({ focus })} options={FOCUS_OPTIONS} />
      </div>
      <p className="mt-3 text-sm text-muted">
        {pool.verbIds.length} {pool.verbIds.length === 1 ? "verb" : "verbs"} · {pool.tenses.length} {pool.tenses.length === 1 ? "tense" : "tenses"}
        {state.dojo.focus === "weak" && " · misses come up most"}
        {state.dojo.focus === "tricky" && " · irregular, stem-changing and spelling-change verbs"}
      </p>
    </Card>
  );
}

function WeakSpots({ state }: { state: LearnerState }) {
  const spots = weakSpots(state);
  return (
    <Card padding="md" aria-labelledby="weak-heading">
      <h2 id="weak-heading" className="text-xl font-extrabold">Weak spots</h2>
      {spots.length === 0 ? (
        <p className="mt-2 text-muted">Drill a few rounds and the forms that trip you up will collect here.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {spots.map((s) => (
            <li key={weakSpotKey(s)}>
              <div className="flex items-baseline justify-between gap-3">
                <span><span lang="es" className="font-extrabold">{s.verb.infinitive}</span> <span className="text-sm text-muted">· {TENSE_INFO[s.tense].label}</span></span>
                <span className="text-sm font-bold text-muted">{Math.round(s.accuracy * 100)}%</span>
              </div>
              <ProgressBar value={s.accuracy * 100} size="sm" tone={s.accuracy < 0.5 ? "chili" : "sol"} label={`${s.verb.infinitive}, ${TENSE_INFO[s.tense].label}: ${Math.round(s.accuracy * 100)}% right`} className="mt-1" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function DojoHub() {
  const learner = useLearner();
  const data = useMemo(() => (learner ? { statuses: beltStatuses(learner.state), unlocked: unlockedTenses(learner.state) } : null), [learner]);

  if (!learner || !data) {
    return (
      <PageContainer className="max-w-5xl">
        <Skeleton className="mb-6 h-12 w-72" />
        <Skeleton className="h-72" />
      </PageContainer>
    );
  }

  const { state } = learner;
  const header = (
    <PageHeader eyebrow="Mini game" title="Conjugation Dojo" subtitle="Just you, a verb and a blinking cursor. Drill every tense you've learned until the forms come without thinking." />
  );

  if (data.unlocked.length === 0) {
    const unit = unitTeaching(TENSE_INFO.present.grammarId);
    return (
      <PageContainer className="max-w-5xl">
        {header}
        <Card padding="lg" className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Mascot mood="sleepy" size={110} />
          <div>
            <h2 className="text-2xl font-extrabold">The Dojo opens in Unit {unit}</h2>
            <p className="mt-1 max-w-lg text-muted">Once you&apos;ve learned how regular verbs work in the present tense, come back and start earning belts.</p>
            <ButtonLink href="/course" size="lg" className="mt-4">Go to the course</ButtonLink>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-5xl">
      {header}
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <RankCard statuses={data.statuses} state={state} />
          <section aria-labelledby="modes-heading">
            <SectionHeading id="modes-heading" title="Practice" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Card tone="teal" padding="md" className="flex flex-col">
                <h3 className="flex items-center gap-2 text-xl font-extrabold"><Dumbbell size={22} aria-hidden="true" /> Training</h3>
                <p className="mt-1 flex-1 text-muted">15 prompts, no clock. Every miss shows the whole tense and comes back at the end.</p>
                <ButtonLink href="/dojo/train" size="lg" className="mt-4" fullWidth>Train</ButtonLink>
              </Card>
              <Card tone="rosa" padding="md" className="flex flex-col">
                <h3 className="flex items-center gap-2 text-xl font-extrabold"><Timer size={22} aria-hidden="true" /> Sparring</h3>
                <p className="mt-1 flex-1 text-muted">60 seconds. Right answers in a row multiply your score.</p>
                <p className="mt-2 text-sm font-bold">
                  Best score <span className="font-display text-lg">{state.dojo.bestSparScore}</span>
                  <span className="mx-2 text-faint">·</span>
                  Best run <span className="font-display text-lg">{state.dojo.bestCombo}</span>
                </p>
                <ButtonLink href="/dojo/spar" size="lg" className="mt-4" fullWidth>Spar</ButtonLink>
              </Card>
            </div>
          </section>
        </div>
        <div className="space-y-5">
          <TensePicker state={state} />
          <WeakSpots state={state} />
        </div>
      </div>
    </PageContainer>
  );
}
