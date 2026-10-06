import { addDaysToKey, daysBetweenKeys } from "@/lib/util/dates";

export interface StreakInfo {
  current: number;
  longest: number;
  activeToday: boolean;
  /** Streak is alive but today's practice would extend it. */
  needsPracticeToday: boolean;
}

/** One missed day is forgiven, at most once in any 7-day window. */
const REST_DAY_COOLDOWN_DAYS = 7;

function restAllowed(lastRestKey: string | null, restDay: string): boolean {
  return lastRestKey === null || daysBetweenKeys(lastRestKey, restDay) >= REST_DAY_COOLDOWN_DAYS;
}

/**
 * Consecutive practice days, with a built-in weekly rest day so one missed
 * day never wipes out progress. Only days with real practice count.
 */
export function computeStreak(activeDayKeys: Iterable<string>, todayKey: string): StreakInfo {
  const days = [...new Set(activeDayKeys)].sort();
  if (days.length === 0) return { current: 0, longest: 0, activeToday: false, needsPracticeToday: false };

  let count = 1;
  let longest = 1;
  let lastRest: string | null = null;

  for (let i = 1; i < days.length; i++) {
    const gap = daysBetweenKeys(days[i - 1], days[i]);
    if (gap === 1) {
      count++;
    } else if (gap === 2 && restAllowed(lastRest, addDaysToKey(days[i - 1], 1))) {
      lastRest = addDaysToKey(days[i - 1], 1);
      count++;
    } else {
      count = 1;
      lastRest = null;
    }
    longest = Math.max(longest, count);
  }

  const last = days[days.length - 1];
  const sinceLast = daysBetweenKeys(last, todayKey);
  const activeToday = sinceLast === 0;
  let alive = false;
  if (sinceLast <= 0) alive = true;
  else if (sinceLast === 1) alive = true;
  else if (sinceLast === 2) alive = restAllowed(lastRest, addDaysToKey(last, 1));

  return {
    current: alive ? count : 0,
    longest,
    activeToday,
    needsPracticeToday: alive && !activeToday,
  };
}
