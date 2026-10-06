"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { ButtonLink } from "@/components/ui/Button";
import { Mascot } from "@/components/brand/Mascot";
import { SRS_CONFIG } from "@/config/srs";
import { selectPracticeQueue, selectReviewQueue } from "@/lib/srs/queue";
import { buildReviewExercises } from "@/lib/srs/review-generator";
import { useLearner, type Learner } from "@/lib/state/hooks";
import { learnedWords } from "@/lib/state/selectors";

type Mode = "review" | "practice";

/** Builds a session once (when state first loads) so reviewing doesn't reshuffle underneath you. */
function buildSession(learner: Learner, mode: Mode) {
  const { state, now } = learner;
  const all = learnedWords(state, now);
  const progress = all.map((w) => w.progress);
  const picked = mode === "review" ? selectReviewQueue(progress, now, SRS_CONFIG.maxSessionSize) : selectPracticeQueue(progress, now, SRS_CONFIG.practiceSize);
  const ids = new Set(picked.map((p) => p.vocabId));
  const words = all.filter((w) => ids.has(w.vocab.id));
  return buildReviewExercises(words, new Set(all.map((w) => w.vocab.id)), String(now));
}

function Runner({ learner, mode }: { learner: Learner; mode: Mode }) {
  const [session] = useState(() => buildSession(learner, mode));

  if (session.exercises.length === 0) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
        <div>
          <Mascot mood="happy" size={110} className="mx-auto" />
          <h1 className="mt-3 text-3xl font-extrabold">{mode === "review" ? "Nothing to review right now" : "Nothing to practice yet"}</h1>
          <p className="mt-2 text-muted">Finish a lesson and the words you meet will be scheduled for review automatically.</p>
          <ButtonLink href={mode === "review" ? "/review" : "/course"} size="lg" className="mt-6">{mode === "review" ? "Back to review" : "Go to the course"}</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <LessonPlayer
      kind={mode}
      title={mode === "review" ? "Review" : "Practice"}
      exercises={session.exercises}
      exitHref="/review"
      continueHref="/review"
    />
  );
}

export function ReviewSession({ mode }: { mode: Mode }) {
  const learner = useLearner();
  if (!learner) return <LoadingScreen />;
  return <Runner learner={learner} mode={mode} />;
}
