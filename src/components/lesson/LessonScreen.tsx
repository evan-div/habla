"use client";

import { Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getLesson } from "@/content/course";
import { useLearner } from "@/lib/state/hooks";
import { lessonStatus } from "@/lib/state/selectors";
import { useRouter } from "next/navigation";
import { LessonPlayer } from "./LessonPlayer";

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const learner = useLearner();
  const [acknowledged, setAcknowledged] = useState(false);
  const lesson = getLesson(lessonId);
  const needsOnboarding = learner !== null && learner.state.profile.onboardedAt === null;

  useEffect(() => {
    if (needsOnboarding) router.replace("/onboarding");
  }, [needsOnboarding, router]);

  if (!learner || !lesson || needsOnboarding) return <LoadingScreen />;

  if (lessonStatus(learner.state, lessonId) === "locked") {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
        <div>
          <Mascot mood="thinking" size={110} className="mx-auto" />
          <h1 className="mt-3 flex items-center justify-center gap-2 text-3xl font-extrabold"><Lock size={26} aria-hidden="true" /> Not yet</h1>
          <p className="mt-2 text-muted">Lessons unlock in order so every word has a foundation. Finish the lesson before this one first.</p>
          <ButtonLink href="/course" size="lg" className="mt-6">Back to the course</ButtonLink>
        </div>
      </div>
    );
  }

  if (lesson.contentWarning && !acknowledged) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-lg place-items-center px-4 text-center">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-soft-rosa text-rosa-500"><ShieldAlert size={34} aria-hidden="true" /></span>
          <h1 className="mt-4 text-3xl font-extrabold">Heads up: real talk</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-muted">{lesson.contentWarning}</p>
          <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
            <ButtonLink href="/course" variant="ghost" size="lg">Not now</ButtonLink>
            <Button size="lg" onClick={() => setAcknowledged(true)}>I&apos;m in — let&apos;s go</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LessonPlayer
      key={lessonId}
      kind="lesson"
      title={lesson.title}
      lessonId={lessonId}
      exercises={lesson.exercises}
      exitHref="/course"
      continueHref="/"
    />
  );
}
