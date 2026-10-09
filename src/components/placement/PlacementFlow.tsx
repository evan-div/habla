"use client";

import { ArrowRight, Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { ExerciseRenderer } from "@/components/lesson/exercises/ExerciseRenderer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ALL_UNITS } from "@/content/course";
import { PLACEMENT } from "@/content/placement";
import { evaluate, type Response } from "@/lib/engine/evaluate";
import { recommendedStart, skipSummary, type LevelOutcome } from "@/lib/placement";
import { choosePlacement } from "@/lib/state/actions";
import { useLearnerState } from "@/lib/state/hooks";

type Phase = "intro" | "quiz" | "result";

const PLAYABLE_UNITS = ALL_UNITS.filter((u) => !u.comingSoon);
const LAST_UNIT = PLAYABLE_UNITS[PLAYABLE_UNITS.length - 1].number;

/** A short, no-feedback check that finds where in the course a learner should begin. */
export function PlacementFlow() {
  const router = useRouter();
  const state = useLearnerState();
  const [phase, setPhase] = useState<Phase>("intro");
  const [outcomes, setOutcomes] = useState<LevelOutcome[]>([]);
  const [tally, setTally] = useState({ correct: 0, answered: 0 });
  const [levelIndex, setLevelIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [response, setResponse] = useState<Response | null>(null);

  const exercise = PLACEMENT[levelIndex]?.exercises[qIndex];

  function submit(giveUp: boolean) {
    if (!exercise) return;
    const unitNumber = PLACEMENT[levelIndex].unitNumber;
    const correct = !giveUp && response !== null && evaluate(exercise, response).correct;
    const nextTally = { correct: tally.correct + (correct ? 1 : 0), answered: tally.answered + 1 };
    setTally(nextTally);
    setResponse(null);

    if (!correct) {
      setOutcomes([...outcomes, { unitNumber, passed: false }]);
      setPhase("result");
    } else if (qIndex === 0) {
      setQIndex(1);
    } else {
      const next = [...outcomes, { unitNumber, passed: true }];
      setOutcomes(next);
      if (levelIndex === PLACEMENT.length - 1) setPhase("result");
      else {
        setLevelIndex(levelIndex + 1);
        setQIndex(0);
      }
    }
  }

  const onEnter = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.repeat && phase === "quiz" && response) {
      e.preventDefault();
      submit(false);
    }
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onEnter(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!state) return <LoadingScreen />;

  const choose = (startUnit: number) => {
    choosePlacement(startUnit, tally);
    router.push("/");
  };

  if (phase === "intro") {
    return (
      <Shell>
        <Mascot mood="thinking" size={120} animated className="mx-auto" />
        <h1 className="mt-4 text-center text-3xl font-extrabold">Find your starting point</h1>
        <p className="mx-auto mt-2 max-w-md text-center text-lg text-muted">A couple of minutes of questions, easiest first. We&apos;ll suggest where in the course to begin.</p>
        <ul className="mx-auto mt-6 max-w-md space-y-3">
          <li className="rounded-2xl bg-soft-teal p-4"><span className="font-extrabold">No guessing.</span> <span className="text-muted">Pick “I don&apos;t know” if you&apos;re unsure — that&apos;s the honest answer we need.</span></li>
          <li className="rounded-2xl bg-soft-sol p-4"><span className="font-extrabold">No feedback, no points.</span> <span className="text-muted">It stops as soon as the questions get hard for you.</span></li>
          <li className="rounded-2xl bg-soft-violet p-4"><span className="font-extrabold">Nothing is lost.</span> <span className="text-muted">Words from skipped lessons join your review, so you&apos;ll check them gently over the next days.</span></li>
        </ul>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-2">
          <Button size="lg" fullWidth onClick={() => setPhase("quiz")}>Start the check</Button>
          <Button variant="ghost" fullWidth onClick={() => router.push("/")}>Start from the beginning</Button>
        </div>
      </Shell>
    );
  }

  if (phase === "result") {
    const start = recommendedStart(outcomes, LAST_UNIT);
    const unit = PLAYABLE_UNITS.find((u) => u.number === start)!;
    const { lessons, wordCount } = skipSummary(start);
    const everything = outcomes.every((o) => o.passed);
    return (
      <Shell>
        <Mascot mood="cheer" size={120} animated className="mx-auto" />
        <p className="mt-3 text-center text-sm font-extrabold uppercase tracking-widest text-on-teal">Your starting point</p>
        <h1 className="mt-1 text-center text-3xl font-extrabold">Unit {unit.number}: {unit.title}</h1>
        <p className="mx-auto mt-2 max-w-md text-center text-lg text-muted">
          {start === 1
            ? "Starting at the beginning is the right call — solid foundations make everything after it easier."
            : everything
              ? "You answered everything correctly — start at the newest unit. More are on the way."
              : `You handled the earlier units well. You'll skip ${lessons.length} lessons and ${wordCount} words, which join your review so you can confirm them.`}
        </p>
        <Card padding="sm" className="mx-auto mt-5 max-w-md text-center">
          <p className="text-sm font-bold text-muted">{tally.correct} of {tally.answered} answered correctly</p>
        </Card>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-2">
          <Button size="lg" fullWidth onClick={() => choose(start)} trailingIcon={<ArrowRight size={20} aria-hidden="true" />}>
            {start === 1 ? "Start Unit 1" : `Start at Unit ${start}`}
          </Button>
          {start > 1 && <Button variant="ghost" fullWidth onClick={() => choose(1)}>Start from the beginning instead</Button>}
        </div>
      </Shell>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 sm:px-6">
      <header className="flex items-center gap-4 py-4">
        <Compass size={24} className="shrink-0 text-muted" aria-hidden="true" />
        <ProgressBar value={levelIndex * 2 + qIndex} max={PLACEMENT.length * 2} label="Placement progress" size="md" className="flex-1" />
      </header>
      <main className="flex-1 pb-8 pt-4">
        {exercise && <ExerciseRenderer key={exercise.id} exercise={exercise} response={response} onRespond={(r) => setResponse(r)} evaluation={null} />}
      </main>
      <footer className="sticky bottom-0 flex items-center justify-between gap-3 border-t-2 border-line bg-bg py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button variant="ghost" onClick={() => submit(true)}>I don&apos;t know</Button>
        <Button size="lg" disabled={!response} onClick={() => submit(false)} className="min-w-40 flex-1 sm:flex-none">Next</Button>
      </footer>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-4 py-10"><div className="animate-rise">{children}</div></div>;
}
