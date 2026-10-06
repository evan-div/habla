"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useEffectEvent, useReducer, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { isScored, type Exercise } from "@/content/types";
import { currentItem, initSession, sessionProgress, sessionReducer, type SessionAction, type SessionState } from "@/lib/engine/session";
import type { Response } from "@/lib/engine/evaluate";
import { commitSession } from "@/lib/state/store";
import type { SessionKind, SessionSummary } from "@/lib/state/types";
import { ExerciseRenderer } from "./exercises/ExerciseRenderer";
import { FeedbackPanel } from "./FeedbackPanel";
import { LessonHeader } from "./LessonHeader";
import { QuitDialog } from "./QuitDialog";
import { SessionComplete } from "./SessionComplete";

/** Idle tabs shouldn't inflate "time studied". */
const MAX_SESSION_SECONDS = 25 * 60;

export interface LessonPlayerProps {
  kind: SessionKind;
  title: string;
  lessonId?: string;
  exercises: Exercise[];
  /** Where the X button and "Continue" lead. */
  exitHref: string;
  continueHref: string;
  continueLabel?: string;
}

export function LessonPlayer({ kind, title, lessonId, exercises, exitHref, continueHref, continueLabel }: LessonPlayerProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(sessionReducer, exercises, initSession);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [quitOpen, setQuitOpen] = useState(false);
  const startedAt = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const finish = useCallback(
    (final: SessionState) => {
      if (finished.current) return;
      finished.current = true;
      const seconds = Math.min(MAX_SESSION_SECONDS, Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
      setSummary(
        commitSession({
          kind,
          lessonId,
          answers: final.answers,
          introducedVocabIds: final.introducedVocabIds,
          seenGrammarIds: final.seenGrammarIds,
          durationSeconds: seconds,
          mistakes: final.mistakes,
        }),
      );
    },
    [kind, lessonId],
  );

  // Dispatch, and — if that action ends the session — commit the results exactly once.
  const act = useCallback(
    (action: SessionAction) => {
      const next = sessionReducer(state, action);
      dispatch(action);
      if (next.phase === "done" && state.phase !== "done") finish(next);
    },
    [state, finish],
  );

  const item = currentItem(state);
  const scored = item ? isScored(item.exercise) : false;
  const canCheck = state.phase === "answering" && scored && state.response !== null;

  const onRespond = useCallback(
    (response: Response | null, options?: { submit?: boolean }) => {
      dispatch({ type: "respond", response });
      if (options?.submit && response) dispatch({ type: "check" });
    },
    [],
  );

  // Enter = check / continue. (useEffectEvent always sees the latest state without re-subscribing.)
  const onEnter = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== "Enter" || e.isComposing || e.repeat) return;
    if (state.phase === "feedback") {
      e.preventDefault();
      act({ type: "continue" });
    } else if (state.phase === "answering") {
      if (!scored) {
        e.preventDefault();
        act({ type: "continue" });
      } else if (canCheck) {
        e.preventDefault();
        act({ type: "check" });
      }
    }
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onEnter(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (summary) {
    return <SessionComplete summary={summary} title={title} continueHref={continueHref} continueLabel={continueLabel} />;
  }
  if (!item) return null; // committing

  const hasProgress = state.index > 0 || state.answers.length > 0;
  const leave = () => router.push(exitHref);

  return (
    <div className="flex min-h-dvh flex-col">
      <LessonHeader title={title} progress={sessionProgress(state)} onClose={() => (hasProgress ? setQuitOpen(true) : leave())} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
          {item.retry && (
            <Badge tone="sol" className="mb-4">Let&apos;s try that one again</Badge>
          )}
          <ExerciseRenderer
            key={item.key}
            exercise={item.exercise}
            response={state.response}
            onRespond={onRespond}
            evaluation={state.evaluation}
          />
        </div>
      </main>

      <footer className="sticky bottom-0 z-20 border-t-2 border-line bg-surface">
        {state.phase === "feedback" && state.evaluation ? (
          <FeedbackPanel
            exercise={item.exercise}
            evaluation={state.evaluation}
            streak={state.correctStreak}
            retry={item.retry}
            answerCount={state.answers.length}
            onContinue={() => act({ type: "continue" })}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            {scored && item.exercise.type === "matching" ? (
              <>
                <Button variant="ghost" onClick={() => act({ type: "skip" })}>Show me</Button>
                <p className="text-sm font-bold text-muted">Match every pair to continue</p>
              </>
            ) : scored ? (
              <>
                <Button variant="ghost" onClick={() => act({ type: "skip" })}>I don&apos;t know</Button>
                <Button size="lg" disabled={!canCheck} onClick={() => act({ type: "check" })} className="min-w-40 flex-1 sm:flex-none">Check</Button>
              </>
            ) : (
              <Button size="lg" onClick={() => act({ type: "continue" })} className="w-full sm:ml-auto sm:w-auto sm:min-w-52" autoFocus>Continue</Button>
            )}
          </div>
        )}
      </footer>

      <QuitDialog open={quitOpen} kind={kind} onStay={() => setQuitOpen(false)} onLeave={leave} />
    </div>
  );
}
