"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { XPBadge } from "@/components/gamification/XPBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";
import { levelInfo } from "@/lib/gamification/levels";
import type { LearnerState } from "@/lib/state/types";
import { streakOf, todayActivity } from "@/lib/state/selectors";

/** Compact progress strip: streak, today's XP and level. */
export function TopBar({ state, now }: { state: LearnerState | null; now: number }) {
  const streak = state && now ? streakOf(state, now) : null;
  const today = state && now ? todayActivity(state, now) : null;
  const level = state ? levelInfo(state.totalXp) : null;

  return (
    <div className="sticky top-0 z-20 border-b-2 border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:justify-end lg:px-8">
        <Link href="/" aria-label="¡Habla! home" className="rounded-xl md:hidden">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {streak && today && state && level ? (
            <>
              <Tooltip side="bottom" content={streak.needsPracticeToday ? "Practice today to keep your streak going. One rest day a week is built in." : "Days in a row you've practiced. One rest day a week is built in, so a missed day won't reset it."}>
                <StreakBadge days={streak.current} pending={streak.needsPracticeToday} />
              </Tooltip>
              <span className="hidden sm:inline-flex">
                <Tooltip side="bottom" content={`XP earned today, out of your ${state.profile.dailyGoalXp} XP daily goal.`}>
                  <XPBadge xp={today.xp} label={`/ ${state.profile.dailyGoalXp} today`} />
                </Tooltip>
              </span>
              <span className="sm:hidden"><XPBadge xp={today.xp} label="XP" size="sm" /></span>
              <Link href="/progress" aria-label={`Level ${level.level}, ${level.title}`} className="hidden items-center gap-2 rounded-2xl py-1 pl-1 pr-3 hover:bg-surface-2 sm:flex">
                <LevelBadge level={level.level} size={34} />
                <span className="text-sm font-extrabold">{level.title}</span>
              </Link>
            </>
          ) : (
            <Skeleton className="h-8 w-40" />
          )}
        </div>
      </div>
    </div>
  );
}
