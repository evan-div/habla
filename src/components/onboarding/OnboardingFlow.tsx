"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mascot, type MascotMood } from "@/components/brand/Mascot";
import { Logo } from "@/components/brand/Logo";
import Link from "next/link";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Button } from "@/components/ui/Button";
import { DAILY_GOAL_OPTIONS, DEFAULT_DAILY_GOAL_XP } from "@/config/xp";
import { COURSE } from "@/content/course";
import { useLearnerState } from "@/lib/state/hooks";
import { completeOnboarding } from "@/lib/state/actions";
import type { Reason, SelfLevel } from "@/lib/state/types";
import { cn } from "@/lib/util/cn";
import { OptionCard } from "./OptionCard";

const LEVELS: Array<{ value: SelfLevel; title: string; detail: string; icon: string }> = [
  { value: "new", title: "I'm completely new", detail: "Never studied Spanish — let's start from zero.", icon: "🌱" },
  { value: "few-words", title: "I know a few words", detail: "Hola, gracias, maybe a menu or two.", icon: "👋" },
  { value: "basic", title: "I know basic Spanish", detail: "I can get by with simple phrases.", icon: "🧭" },
  { value: "simple-conversations", title: "I can have simple conversations", detail: "I want to fill gaps and level up.", icon: "💬" },
];

const REASONS: Array<{ value: Reason; title: string; icon: string }> = [
  { value: "travel", title: "Travel", icon: "✈️" },
  { value: "conversation", title: "Conversation", icon: "💬" },
  { value: "fluency", title: "Fluency", icon: "🎯" },
  { value: "family", title: "Friends / family", icon: "👨‍👩‍👧" },
  { value: "work", title: "Work", icon: "💼" },
  { value: "culture", title: "Culture", icon: "🎶" },
  { value: "other", title: "Other", icon: "✨" },
];

const STEPS = ["welcome", "name", "level", "reasons", "goal", "plan"] as const;
type Step = (typeof STEPS)[number];

const MOOD: Record<Step, MascotMood> = { welcome: "cheer", name: "happy", level: "thinking", reasons: "happy", goal: "happy", plan: "cheer" };

export function OnboardingFlow() {
  const router = useRouter();
  const state = useLearnerState();
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<SelfLevel | null>(null);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [goal, setGoal] = useState<number>(DEFAULT_DAILY_GOAL_XP);

  // Where to go once onboarding is saved (people who know some Spanish get a placement check).
  const destination = useRef("/");
  const alreadyDone = state !== null && state.profile.onboardedAt !== null;
  useEffect(() => {
    if (alreadyDone) router.replace(destination.current);
  }, [alreadyDone, router]);

  if (!state || alreadyDone) return <LoadingScreen />;

  const step = STEPS[stepIndex];
  const canContinue = step === "level" ? level !== null : step === "reasons" ? reasons.length > 0 : true;

  function next() {
    if (step === "plan") {
      destination.current = level && level !== "new" ? "/placement" : "/";
      completeOnboarding({ displayName: name.trim(), selfLevel: level ?? "new", reasons, dailyGoalXp: goal });
      return;
    }
    setStepIndex((i) => i + 1);
  }

  const toggleReason = (r: Reason) => setReasons((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-8 pt-5 sm:pt-8">
      <header className="flex items-center gap-3">
        {stepIndex > 0 ? (
          <button type="button" onClick={() => setStepIndex((i) => i - 1)} aria-label="Back" className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-surface-2">
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
        ) : (
          <span className="h-11 w-11" />
        )}
        <ol className="flex flex-1 justify-center gap-2" aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <li key={s} className={cn("h-2.5 w-9 rounded-full transition-colors", i <= stepIndex ? "bg-teal-500" : "bg-line")} />
          ))}
        </ol>
        <span className="h-11 w-11" />
      </header>

      <main className="flex flex-1 flex-col justify-center py-6" key={step}>
        <div className="animate-rise">
          <Mascot mood={MOOD[step]} size={step === "welcome" ? 150 : 100} animated className="mx-auto" />

          {step === "welcome" && (
            <div className="mt-4 text-center">
              <Logo className="mb-3" />
              <h1 className="text-4xl font-extrabold">Learn Spanish the way it&apos;s really spoken</h1>
              <p className="mx-auto mt-3 max-w-md text-lg text-muted">
                A real course — vocabulary, clear grammar, listening and smart review — built around Mexican Spanish. I&apos;m Lolo, and I&apos;ll be your guide.
              </p>
            </div>
          )}

          {step === "name" && (
            <div className="mt-4">
              <h1 className="text-center text-3xl font-extrabold">¡Mucho gusto! What should we call you?</h1>
              <label htmlFor="name" className="sr-only">Your name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="Your first name (optional)"
                autoComplete="given-name"
                className="mt-6 h-16 w-full rounded-2xl border-2 border-line-strong bg-surface px-5 text-center font-display text-2xl font-bold outline-none placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-faint focus:border-teal-500"
              />
            </div>
          )}

          {step === "level" && (
            <div className="mt-4">
              <h1 className="text-center text-3xl font-extrabold">What is your Spanish level?</h1>
              <div role="radiogroup" aria-label="Spanish level" className="mt-6 space-y-3">
                {LEVELS.map((l) => (
                  <OptionCard key={l.value} selected={level === l.value} onSelect={() => setLevel(l.value)} title={l.title} detail={l.detail} icon={l.icon} />
                ))}
              </div>
            </div>
          )}

          {step === "reasons" && (
            <div className="mt-4">
              <h1 className="text-center text-3xl font-extrabold">Why are you learning Spanish?</h1>
              <p className="mt-1 text-center text-muted">Pick all that apply.</p>
              <div role="group" aria-label="Reasons" className="mt-6 grid gap-3 sm:grid-cols-2">
                {REASONS.map((r) => (
                  <OptionCard key={r.value} role="checkbox" selected={reasons.includes(r.value)} onSelect={() => toggleReason(r.value)} title={r.title} icon={r.icon} />
                ))}
              </div>
            </div>
          )}

          {step === "goal" && (
            <div className="mt-4">
              <h1 className="text-center text-3xl font-extrabold">Pick a daily goal</h1>
              <p className="mt-1 text-center text-muted">Steady beats intense. You can change this any time.</p>
              <div role="radiogroup" aria-label="Daily XP goal" className="mt-6 space-y-3">
                {DAILY_GOAL_OPTIONS.map((g) => (
                  <OptionCard key={g.xp} selected={goal === g.xp} onSelect={() => setGoal(g.xp)} title={`${g.label} · ${g.xp} XP`} detail={g.detail} />
                ))}
              </div>
            </div>
          )}

          {step === "plan" && (
            <div className="mt-4 text-center">
              <h1 className="text-3xl font-extrabold">Your plan{name.trim() ? `, ${name.trim()}` : ""}</h1>
              <ul className="mx-auto mt-5 max-w-md space-y-3 text-left">
                <li className="rounded-2xl bg-soft-teal p-4">{level && level !== "new" ? (<><span className="font-extrabold">A quick placement check.</span> <span className="text-muted">A couple of minutes of questions will suggest where in {COURSE.title} to begin — or you can start at Unit 1.</span></>) : (<><span className="font-extrabold">Start at the beginning.</span> <span className="text-muted">{COURSE.title} begins with Unit 1: Hello. Solid foundations make everything later easier.</span></>)}</li>
                <li className="rounded-2xl bg-soft-sol p-4"><span className="font-extrabold">{goal} XP a day.</span> <span className="text-muted">Roughly {Math.max(1, Math.round(goal / 65))} lesson{goal >= 100 ? "s" : ""} — and your words come back in review.</span></li>
                <li className="rounded-2xl bg-soft-violet p-4"><span className="font-extrabold">Already know some?</span> <span className="text-muted">Turn on “Open course” in your profile to jump to any lesson.</span></li>
              </ul>
            </div>
          )}
        </div>
      </main>

      <div className="flex flex-col gap-2">
        <Button size="lg" fullWidth disabled={!canContinue} onClick={next}>
          {step === "welcome" ? "Let's start" : step === "plan" ? (level && level !== "new" ? "Find my starting point" : "Start learning") : "Continue"}
        </Button>
        {step === "name" && <Button variant="ghost" fullWidth onClick={next}>Skip</Button>}
        {step === "welcome" && (
          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-on-teal underline-offset-2 hover:underline">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
