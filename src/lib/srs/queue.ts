import { SRS_CONFIG as S } from "@/config/srs";
import type { WordProgress } from "@/lib/state/types";
import { masteryAt, retention } from "@/lib/mastery/mastery";
import { DAY } from "@/lib/util/dates";
import { isDue } from "./scheduler";

const RECENT_MISS_WINDOW = 2 * DAY;

/**
 * Higher = review sooner. Blends the five signals the product cares about:
 * weakness, recent misses, staleness, newness, and approaching-forgetting.
 */
export function priorityScore(word: WordProgress, now: number): number {
  const mastery = masteryAt(word, now) / 100;
  const sinceReview = (now - (word.lastReviewed ?? word.createdAt)) / DAY;
  const weakness = 1 - mastery;
  const recentMiss = word.lastIncorrectAt !== null && now - word.lastIncorrectAt < RECENT_MISS_WINDOW ? 1 : 0;
  const overdue = Math.min(3, Math.max(0, (now - word.nextReview) / (Math.max(word.intervalDays, 1) * DAY))) / 3;
  const isNew = word.timesSeen <= 3 ? 1 : 0;
  const forgetting = 1 - retention(sinceReview, word.intervalDays);
  return 3 * weakness + 2 * recentMiss + 1.5 * overdue + 1 * isNew + 2 * forgetting;
}

export function dueWords(words: WordProgress[], now: number): WordProgress[] {
  return words.filter((w) => isDue(w, now));
}

/** The words a review session should cover, most urgent first. */
export function selectReviewQueue(words: WordProgress[], now: number, limit: number = S.maxSessionSize): WordProgress[] {
  return dueWords(words, now)
    .map((w) => ({ w, score: priorityScore(w, now) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.w);
}

/** When nothing is due: the weakest words, so there's always something useful to practice. */
export function selectPracticeQueue(words: WordProgress[], now: number, limit: number = S.practiceSize): WordProgress[] {
  return [...words]
    .map((w) => ({ w, mastery: masteryAt(w, now), score: priorityScore(w, now) }))
    .sort((a, b) => a.mastery - b.mastery || b.score - a.score)
    .slice(0, limit)
    .map((x) => x.w);
}

export interface ReviewForecast {
  dueNow: number;
  dueToday: number;
  tomorrow: number;
  thisWeek: number;
}

export function reviewForecast(words: WordProgress[], now: number, todayEnd: number, tomorrowEnd: number): ReviewForecast {
  const weekEnd = tomorrowEnd + 5 * DAY;
  let dueNow = 0;
  let dueToday = 0;
  let tomorrow = 0;
  let thisWeek = 0;
  for (const w of words) {
    if (w.nextReview <= now) dueNow++;
    else if (w.nextReview <= todayEnd) dueToday++;
    else if (w.nextReview <= tomorrowEnd) tomorrow++;
    else if (w.nextReview <= weekEnd) thisWeek++;
  }
  return { dueNow, dueToday, tomorrow, thisWeek };
}
