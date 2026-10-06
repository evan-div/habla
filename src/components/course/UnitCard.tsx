import { ChevronDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Unit } from "@/content/types";
import { lessonStatus, unitProgress } from "@/lib/state/selectors";
import type { LearnerState } from "@/lib/state/types";
import { cn } from "@/lib/util/cn";
import { ACCENT_TILE } from "./accent";
import { LessonCard } from "./LessonCard";

interface UnitCardProps {
  unit: Unit;
  state: LearnerState;
  nextLessonId: string | null;
  defaultOpen: boolean;
}

export function UnitCard({ unit, state, nextLessonId, defaultOpen }: UnitCardProps) {
  if (unit.comingSoon) return <ComingSoonUnit unit={unit} />;

  const progress = unitProgress(state, unit);
  const allLessons = unit.lessons;

  return (
    <details open={defaultOpen} className="group rounded-3xl border-2 border-line bg-surface shadow-card">
      <summary className="flex cursor-pointer list-none items-center gap-4 rounded-3xl p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl", ACCENT_TILE[unit.accent])}>
          {progress.done ? <Check size={28} strokeWidth={3} aria-hidden="true" /> : <Icon name={unit.icon} size={28} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-extrabold uppercase tracking-widest text-muted">Unit {unit.number}</span>
          <span className="block font-display text-2xl font-extrabold leading-tight">{unit.title}</span>
          <span className="mt-0.5 block text-[15px] text-muted">{unit.description}</span>
          <span className="mt-2 flex items-center gap-3">
            <ProgressBar value={progress.completed} max={progress.total} tone={progress.done ? "leaf" : "brand"} size="sm" label={`Unit ${unit.number} progress`} className="max-w-48" />
            <span className="text-sm font-bold text-muted">{progress.completed}/{progress.total} lessons</span>
          </span>
        </span>
        <ChevronDown size={24} className="shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ol className="space-y-2.5 px-4 pb-4 sm:px-5 sm:pb-5">
        {allLessons.map((lesson, i) => {
          const status = lessonStatus(state, lesson.id);
          const prev = i > 0 ? allLessons[i - 1] : undefined;
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={i + 1}
              status={status}
              isNext={lesson.id === nextLessonId}
              blockedBy={status === "locked" ? (prev?.title ?? "the previous unit") : undefined}
            />
          );
        })}
      </ol>
    </details>
  );
}

function ComingSoonUnit({ unit }: { unit: Unit }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border-2 border-dashed border-line bg-surface-2/50 p-4 sm:p-5">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-line text-faint">
        <Icon name={unit.icon} size={28} />
      </span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted">
          Unit {unit.number} <Badge tone="neutral">Coming soon</Badge>
        </p>
        <p className="font-display text-xl font-extrabold leading-tight text-muted">{unit.title}</p>
        <p className="mt-0.5 text-[15px] text-muted">{unit.description}</p>
        {unit.preview && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {unit.preview.map((p) => <li key={p} className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-muted ring-1 ring-line">{p}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
