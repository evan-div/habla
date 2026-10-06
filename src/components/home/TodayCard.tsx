import { Flame } from "lucide-react";
import { DailyGoalRing } from "@/components/gamification/DailyGoalRing";
import { Card } from "@/components/ui/Card";
import type { LearnerState } from "@/lib/state/types";
import { activityOn, streakOf } from "@/lib/state/selectors";
import { cn } from "@/lib/util/cn";
import { dateKey, weekKeys } from "@/lib/util/dates";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function TodayCard({ state, now }: { state: LearnerState; now: number }) {
  const today = dateKey(now);
  const activity = activityOn(state, today);
  const streak = streakOf(state, now);
  const goal = state.profile.dailyGoalXp;
  const reached = activity.xp >= goal;

  return (
    <Card padding="md" className="flex h-full flex-col">
      <h2 className="text-sm font-extrabold uppercase tracking-widest text-muted">Today</h2>
      <div className="mt-3 flex items-center gap-5">
        <DailyGoalRing xp={activity.xp} goal={goal} size={128} />
        <div className="min-w-0">
          <p className="text-lg font-extrabold leading-snug">
            {reached ? "Daily goal reached!" : `${goal - activity.xp} XP to your goal`}
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-bold text-on-rosa">
            <Flame size={18} className="text-rosa-500" fill={streak.current > 0 && !streak.needsPracticeToday ? "currentColor" : "none"} aria-hidden="true" />
            {streak.current > 0 ? `${streak.current} day streak` : "Start a streak today"}
          </p>
          {streak.needsPracticeToday && <p className="mt-1 text-sm text-muted">Practice today to keep it going.</p>}
        </div>
      </div>
      <ol className="mt-5 grid grid-cols-7 gap-1.5" aria-label="This week">
        {weekKeys(today).map((key, i) => {
          const a = state.activity[key];
          const done = Boolean(a && a.lessons + a.reviews > 0);
          const isToday = key === today;
          return (
            <li key={key} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border-2 text-xs font-extrabold",
                  done ? "border-transparent bg-sol-300 text-[#4a3300]" : "border-line bg-surface-2 text-faint",
                  isToday && !done && "border-teal-500 text-on-teal",
                )}
              >
                {done ? "✓" : DAY_LABELS[i]}
                <span className="sr-only">{done ? " practiced" : isToday ? " today, not yet" : " no practice"}</span>
              </span>
              <span className="text-[10px] font-bold uppercase text-muted">{isToday ? "Today" : ""}</span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
