import { ArrowRight, PartyPopper } from "lucide-react";
import { Mascot } from "@/components/brand/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { COURSE } from "@/content/course";
import type { UpNext } from "@/lib/state/selectors";

interface ContinueCardProps {
  upNext: UpNext | null;
  /** Whole-unit completion for the progress strip. */
  unitCompleted: number;
  isFirstLesson: boolean;
}

/** "What should I study today?" — the single most important card in the app. */
export function ContinueCard({ upNext, unitCompleted, isFirstLesson }: ContinueCardProps) {
  if (!upNext) {
    return (
      <Card tone="brand" padding="lg" className="relative overflow-hidden">
        <div className="max-w-md">
          <p className="mb-1 flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest opacity-90"><PartyPopper size={18} aria-hidden="true" /> {COURSE.title}</p>
          <h2 className="text-3xl font-extrabold">You finished every lesson so far!</h2>
          <p className="mt-2 opacity-90">More units are on the way. In the meantime, keep your words fresh with a review.</p>
          <ButtonLink href="/review" variant="secondary" size="lg" className="mt-5" trailingIcon={<ArrowRight size={20} aria-hidden="true" />}>Go to review</ButtonLink>
        </div>
        <Mascot mood="cheer" size={150} animated className="absolute -bottom-2 right-4 hidden sm:block" />
      </Card>
    );
  }

  const { lesson, unit, section, position, unitLessonCount } = upNext;
  const pct = Math.round((unitCompleted / unitLessonCount) * 100);

  return (
    <Card tone="brand" padding="lg" className="relative overflow-hidden">
      <div className="relative z-10 max-w-lg">
        <p className="text-xs font-extrabold uppercase tracking-widest opacity-85">
          {COURSE.title} · Section {section.number}: {section.title}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Unit {unit.number}: {unit.title}
        </h2>
        <p className="mt-2 text-lg font-bold">
          Lesson {position} of {unitLessonCount}
          <span className="font-semibold opacity-90"> · {lesson.title}</span>
        </p>
        <p className="mt-0.5 opacity-90">{lesson.subtitle}</p>

        <div
          className="mt-4 h-2.5 max-w-xs overflow-hidden rounded-full bg-black/15"
          role="progressbar"
          aria-label={`Unit ${unit.number} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div className="h-full rounded-full bg-white/90 transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>

        <ButtonLink
          href={`/learn/${lesson.id}`}
          variant="secondary"
          size="lg"
          className="mt-6 !text-teal-700 dark:!text-ink"
          trailingIcon={<ArrowRight size={20} aria-hidden="true" />}
        >
          {isFirstLesson ? "Start your first lesson" : "Continue Lesson"}
        </ButtonLink>
        <span className="ml-3 text-sm font-semibold opacity-90">~{lesson.estimatedMinutes} min</span>
      </div>
      <Mascot mood="happy" size={170} animated className="absolute -bottom-3 right-3 hidden sm:block lg:right-8" />
    </Card>
  );
}
