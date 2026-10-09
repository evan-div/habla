import { LevelBadge } from "@/components/gamification/LevelBadge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ALL_LESSONS } from "@/content/course";
import { levelInfo } from "@/lib/gamification/levels";
import type { LearnerState } from "@/lib/state/types";
import { lessonsDoneCount } from "@/lib/state/selectors";

export function LevelCard({ state }: { state: LearnerState }) {
  const info = levelInfo(state.totalXp);
  const lessonsDone = lessonsDoneCount(state);
  return (
    <Card padding="md" className="flex h-full flex-col">
      <h2 className="text-sm font-extrabold uppercase tracking-widest text-muted">Your Spanish</h2>
      <div className="mt-3 flex items-center gap-4">
        <LevelBadge level={info.level} size={64} />
        <div>
          <p className="font-display text-2xl font-extrabold leading-tight">{info.title}</p>
          <p className="text-sm text-muted">Level {info.level} · {state.totalXp.toLocaleString()} XP</p>
        </div>
      </div>
      <ProgressBar value={info.progress * 100} tone="violet" label={`Progress to level ${info.level + 1}`} className="mt-4" />
      <p className="mt-1.5 text-sm text-muted">{info.xpForLevel - info.xpIntoLevel} XP to <span className="font-bold text-ink">{info.nextTitle}</span></p>
      <div className="mt-4 border-t-2 border-line pt-3">
        <p className="text-sm font-bold">Course progress</p>
        <ProgressBar value={lessonsDone} max={ALL_LESSONS.length} tone="brand" size="sm" label="Course progress" className="mt-1.5" />
        <p className="mt-1 text-sm text-muted">{lessonsDone} of {ALL_LESSONS.length} lessons so far</p>
      </div>
    </Card>
  );
}
