"use client";

import { Heart, Timer, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useEffectEvent, useReducer, useRef, useState, type FormEvent } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { QuitDialog } from "@/components/lesson/QuitDialog";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BELT_TEST, getDojoVerb, type Belt } from "@/lib/dojo/catalog";
import type { DojoSummary } from "@/lib/dojo/commit";
import { buildQueue } from "@/lib/dojo/prompts";
import { beltPool, nextBeltStatus, practicePool } from "@/lib/dojo/selectors";
import {
  beltPassed,
  comboMultiplier,
  currentDojoItem,
  dojoSessionReducer,
  initDojoSession,
  SPAR_SECONDS,
  type DojoMode,
  type DojoSessionAction,
  type DojoSessionState,
} from "@/lib/dojo/session";
import { useLearner, type Learner } from "@/lib/state/hooks";
import { commitDojoSession } from "@/lib/state/store";
import { cn } from "@/lib/util/cn";
import { BeltIcon } from "./BeltIcon";
import { ConjugationInput } from "./ConjugationInput";
import { DojoComplete } from "./DojoComplete";
import { DojoFeedback } from "./DojoFeedback";
import { FormsTable, PromptCard } from "./PromptCard";

const TRAIN_LENGTH = 15;
const SPAR_MS = SPAR_SECONDS * 1000;
/** Sparring moves on by itself: a beat to enjoy a hit, longer to read a miss. */
const SPAR_ADVANCE_MS = { hit: 450, miss: 1600 } as const;
/** Idle tabs shouldn't inflate "time studied". */
const MAX_SESSION_SECONDS = 25 * 60;

interface Setup {
  init: DojoSessionState;
  belt?: Belt;
}

/** Built once per round, from the learner's state at the time. */
function buildSetup(learner: Learner, mode: DojoMode): Setup | null {
  const { state, now } = learner;
  const seed = now % 2_147_483_647;
  if (mode === "belt") {
    const next = nextBeltStatus(state);
    if (!next?.ready) return null;
    const prompts = buildQueue(beltPool(state, next.belt), state.dojo.stats, "all", BELT_TEST.length, seed);
    return { init: initDojoSession({ mode: "belt", prompts, lives: BELT_TEST.lives }), belt: next.belt };
  }
  const pool = practicePool(state, state.dojo.tenses, state.dojo.focus);
  if (pool.tenses.length === 0 || pool.verbIds.length === 0) return null;
  if (mode === "train") return { init: initDojoSession({ mode: "train", prompts: buildQueue(pool, state.dojo.stats, state.dojo.focus, TRAIN_LENGTH, seed) }) };
  return { init: initDojoSession({ mode: "spar", pool, stats: state.dojo.stats, focus: state.dojo.focus, seed }) };
}

const TITLE: Record<DojoMode, string> = { train: "Training", spar: "Sparring", belt: "Belt test" };

function Header({ state, belt, remainingMs, onClose }: { state: DojoSessionState; belt?: Belt; remainingMs: number; onClose: () => void }) {
  const seconds = Math.ceil(remainingMs / 1000);
  return (
    <header className="sticky top-0 z-20 border-b-2 border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center gap-3 px-3 sm:gap-5 sm:px-6">
        <button type="button" onClick={onClose} aria-label={`Leave ${TITLE[state.mode].toLowerCase()}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink">
          <X size={26} aria-hidden="true" />
        </button>
        {state.mode === "spar" ? (
          <>
            <span className={cn("flex w-14 shrink-0 items-center gap-1 font-display text-xl font-extrabold tabular-nums", seconds <= 10 && state.phase !== "ready" && "text-chili-600")} aria-label={`${seconds} seconds left`}>
              <Timer size={20} aria-hidden="true" />
              {seconds}
            </span>
            <ProgressBar value={remainingMs} max={SPAR_MS} size="lg" tone={seconds <= 10 ? "chili" : "violet"} label="Time left" className="flex-1" />
            <span className="shrink-0 text-right" aria-label={`Score ${state.score}`}>
              <span className="block font-display text-xl font-extrabold leading-none tabular-nums">{state.score}</span>
              <span className={cn("text-xs font-extrabold", comboMultiplier(state.combo) > 1 ? "text-on-sol" : "text-muted")}>×{comboMultiplier(state.combo)}</span>
            </span>
          </>
        ) : (
          <>
            {belt && <BeltIcon belt={belt} size={40} />}
            <ProgressBar value={state.index} max={state.items.length} size="lg" tone="brand" label={`${TITLE[state.mode]} progress`} className="flex-1" />
            {state.lives !== null && (
              <span className="flex shrink-0 gap-0.5" aria-label={`${state.lives} of ${BELT_TEST.lives} lives left`}>
                {Array.from({ length: BELT_TEST.lives }, (_, i) => (
                  <Heart key={i} size={22} aria-hidden="true" className={cn(i < state.lives! ? "fill-rosa-500 text-rosa-500" : "text-line-strong", i === state.lives && "animate-shake")} />
                ))}
              </span>
            )}
          </>
        )}
      </div>
    </header>
  );
}

function Play({ setup, mode, onAgain }: { setup: Setup; mode: DojoMode; onAgain: () => void }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(dojoSessionReducer, setup.init);
  const [summary, setSummary] = useState<DojoSummary | null>(null);
  const [quitOpen, setQuitOpen] = useState(false);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [clock, setClock] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const finish = useCallback(
    (final: DojoSessionState) => {
      if (finished.current) return;
      finished.current = true;
      const seconds = Math.min(MAX_SESSION_SECONDS, Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
      setSummary(
        commitDojoSession({
          mode,
          answers: final.answers,
          durationSeconds: seconds,
          score: final.score,
          bestCombo: final.bestCombo,
          beltId: setup.belt?.id,
          passed: setup.belt ? beltPassed(final) : undefined,
        }),
      );
    },
    [mode, setup.belt],
  );

  // Dispatch, and — if that action ends the round — commit the results exactly once.
  const act = useCallback(
    (action: DojoSessionAction) => {
      const next = dojoSessionReducer(state, action);
      dispatch(action);
      if (next.phase === "done" && state.phase !== "done") finish(next);
    },
    [state, finish],
  );

  const start = useCallback(() => {
    const now = Date.now();
    setEndsAt(now + SPAR_MS);
    setClock(now);
    act({ type: "start" });
  }, [act]);

  /** Enter / the form's submit: check, continue or start, whichever fits. */
  const primary = useCallback(() => {
    if (state.phase === "ready") start();
    else if (state.phase === "answering") act({ type: "check" });
    else if (state.phase === "feedback") act({ type: "continue" });
  }, [state.phase, start, act]);

  // Sparring clock.
  const onTick = useEffectEvent(() => {
    const now = Date.now();
    setClock(now);
    if (endsAt !== null && now >= endsAt) act({ type: "timeUp" });
  });
  const running = mode === "spar" && endsAt !== null && state.phase !== "done";
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => onTick(), 100);
    return () => clearInterval(id);
  }, [running]);

  // Sparring moves on without a Continue press.
  const onAutoAdvance = useEffectEvent(() => act({ type: "continue" }));
  const verdict = state.result?.correct;
  useEffect(() => {
    if (mode !== "spar" || state.phase !== "feedback") return;
    const id = setTimeout(() => onAutoAdvance(), verdict ? SPAR_ADVANCE_MS.hit : SPAR_ADVANCE_MS.miss);
    return () => clearTimeout(id);
  }, [mode, state.phase, state.index, verdict]);

  // Keep the cursor in the answer box for every new prompt.
  useEffect(() => {
    if (state.phase === "answering") inputRef.current?.focus();
  }, [state.phase, state.index]);

  // Enter anywhere outside the form (e.g. after clicking the page) still drives the round.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== "Enter" || e.isComposing || e.repeat) return;
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "BUTTON" || target.tagName === "A")) return;
    e.preventDefault();
    primary();
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (summary) return <DojoComplete summary={summary} answers={state.answers} onAgain={onAgain} />;

  const item = currentDojoItem(state);
  const verb = item ? getDojoVerb(item.prompt.verbId) : undefined;
  if (!item || !verb) return null; // committing

  const remainingMs = endsAt === null ? SPAR_MS : Math.max(0, Math.min(SPAR_MS, endsAt - clock));
  const hasProgress = state.answers.length > 0;
  const leave = () => router.push("/dojo");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    primary();
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header state={state} belt={setup.belt} remainingMs={remainingMs} onClose={() => (hasProgress ? setQuitOpen(true) : leave())} />

      <main className="flex-1">
        {state.phase === "ready" ? (
          <div className="mx-auto max-w-md px-4 pt-12 text-center">
            <Mascot mood="happy" size={110} className="mx-auto" animated />
            <h1 className="mt-3 text-4xl font-extrabold">Sparring</h1>
            <p className="mt-2 text-lg text-muted">
              {SPAR_SECONDS} seconds on the clock. Every right answer scores 10 — five in a row doubles it, ten triples it.
            </p>
            <Button size="lg" onClick={start} className="mt-6 w-full sm:w-auto sm:min-w-56" autoFocus>
              ¡Empezamos!
            </Button>
            <p className="mt-3 text-sm text-muted">Tip: press Enter to submit — accents count.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl space-y-6 px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
            {item.retry && <p className="text-center text-sm font-extrabold uppercase tracking-widest text-on-sol">One more try</p>}
            <PromptCard verb={verb} tense={item.prompt.tense} person={item.prompt.person} />
            <ConjugationInput
              inputRef={inputRef}
              value={state.input}
              onChange={(value) => act({ type: "input", value })}
              verdict={state.phase === "feedback" ? (state.result?.correct ?? false) : null}
              label={`${verb.infinitive}, ${item.prompt.person}`}
            />
            {state.phase === "feedback" && state.result && !state.result.correct && mode !== "spar" && (
              <div className="mx-auto max-w-md">
                <FormsTable verb={verb} tense={item.prompt.tense} person={item.prompt.person} />
              </div>
            )}
            {/* Lets the phone keyboard's Go key submit. */}
            <button type="submit" className="sr-only" tabIndex={-1}>Submit</button>
          </form>
        )}
      </main>

      {state.phase !== "ready" && (
        <footer className="sticky bottom-0 z-20 border-t-2 border-line bg-surface">
          {state.phase === "feedback" && state.result ? (
            <DojoFeedback
              result={state.result}
              given={state.input.trim()}
              answerCount={state.answers.length}
              points={state.lastPoints}
              combo={state.combo}
              onContinue={() => act({ type: "continue" })}
            />
          ) : (
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
              <Button variant="ghost" onClick={() => act({ type: "skip" })}>
                {mode === "spar" ? "Pass" : "I don't know"}
              </Button>
              <Button size="lg" disabled={!state.input.trim()} onClick={() => act({ type: "check" })} className="min-w-40 flex-1 sm:flex-none">
                Check
              </Button>
            </div>
          )}
        </footer>
      )}

      <QuitDialog open={quitOpen} kind="practice" onStay={() => setQuitOpen(false)} onLeave={leave} />
    </div>
  );
}

function Unavailable({ mode }: { mode: DojoMode }) {
  return (
    <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
      <div>
        <Mascot mood="thinking" size={110} className="mx-auto" />
        <h1 className="mt-3 text-3xl font-extrabold">{mode === "belt" ? "No belt test right now" : "Nothing to drill yet"}</h1>
        <p className="mt-2 text-muted">
          {mode === "belt" ? "Your next belt opens up as the course teaches its tenses. Check the Dojo to see what's next." : "The Dojo opens once you've learned the regular present tense in the course."}
        </p>
        <ButtonLink href="/dojo" size="lg" className="mt-6">Back to the Dojo</ButtonLink>
      </div>
    </div>
  );
}

function Runner({ learner, mode }: { learner: Learner; mode: DojoMode }) {
  const [round, setRound] = useState(0);
  // Rebuilt for each round so "Go again" reflects what was just learned.
  const [setup, setSetup] = useState(() => buildSetup(learner, mode));
  if (!setup) return <Unavailable mode={mode} />;
  const again = () => {
    setSetup(buildSetup(learner, mode));
    setRound((r) => r + 1);
  };
  return <Play key={round} setup={setup} mode={mode} onAgain={again} />;
}

export function DojoSession({ mode }: { mode: DojoMode }) {
  const learner = useLearner();
  if (!learner) return <LoadingScreen />;
  return <Runner learner={learner} mode={mode} />;
}
