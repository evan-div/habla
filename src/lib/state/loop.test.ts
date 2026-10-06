import { describe, expect, it } from "vitest";
import { ALL_LESSONS, grammarTaught, introducedWordIds } from "@/content/course";
import { simulateAnswers } from "@/lib/engine/test-utils";
import { masteryAt } from "@/lib/mastery/mastery";
import { selectReviewQueue } from "@/lib/srs/queue";
import { buildReviewExercises } from "@/lib/srs/review-generator";
import { DAY, MINUTE, dateKey } from "@/lib/util/dates";
import { applySession } from "./commit";
import { createInitialState } from "./initial";
import { achievementsOf, learnedWords, nextLesson, lessonStatus, streakOf } from "./selectors";
import type { LearnerState, SessionPayload } from "./types";

const T0 = new Date(2026, 9, 6, 10, 0).getTime();
const lesson1 = ALL_LESSONS[0];

function lessonPayload(lessonId: string, allCorrect = true): SessionPayload {
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId)!;
  return {
    kind: "lesson",
    lessonId,
    answers: simulateAnswers(lesson.exercises, { allCorrect }),
    introducedVocabIds: introducedWordIds(lesson.exercises),
    seenGrammarIds: grammarTaught(lesson),
    durationSeconds: 300,
    mistakes: [],
  };
}

function onboarded(): LearnerState {
  const s = createInitialState("test");
  return { ...s, profile: { ...s.profile, onboardedAt: T0, dailyGoalXp: 50 } };
}

describe("core learning loop", () => {
  const first = applySession(onboarded(), lessonPayload(lesson1.id), T0);

  it("completes a lesson: XP, accuracy, streak, achievements, unlocks the next lesson", () => {
    const { state, summary } = first;
    expect(state.lessons[lesson1.id]).toBeDefined();
    expect(summary.accuracy).toBe(1);
    expect(summary.xpTotal).toBeGreaterThan(40);
    expect(state.totalXp).toBe(summary.xpTotal);
    expect(summary.streak.current).toBe(1);
    expect(summary.newAchievementIds).toEqual(expect.arrayContaining(["first-lesson", "perfect-lesson"]));
    expect(summary.dailyGoal.justReached).toBe(true); // goal was 50
    expect(lessonStatus(state, ALL_LESSONS[1].id)).toBe("available");
    expect(nextLesson(state)?.lesson.id).toBe(ALL_LESSONS[1].id);
  });

  it("records every introduced word with mastery and a review scheduled for tomorrow", () => {
    const { state, summary } = first;
    const intro = introducedWordIds(lesson1.exercises);
    expect(summary.newWordIds.sort()).toEqual([...intro].sort());
    for (const id of intro) {
      const w = state.words[id];
      expect(w.timesSeen).toBeGreaterThanOrEqual(1); // words met only in a “how people say it” card are seen once
      expect(w.nextReview).toBeGreaterThan(T0 + 20 * 60 * MINUTE);
      expect(masteryAt(w, T0)).toBeGreaterThanOrEqual(5);
    }
    expect(selectReviewQueue(Object.values(state.words), T0 + 60 * MINUTE)).toHaveLength(0);
  });

  it("brings words back for review after a day, and a correct review pushes them out to ~3 days", () => {
    const t1 = T0 + DAY + 5 * MINUTE;
    const words = learnedWords(first.state, t1);
    const due = words.filter((w) => w.due);
    expect(due.length).toBe(words.length);

    const { exercises } = buildReviewExercises(due, new Set(words.map((w) => w.vocab.id)), "seed");
    const reviewed = applySession(
      first.state,
      { kind: "review", answers: simulateAnswers(exercises), introducedVocabIds: [], seenGrammarIds: [], durationSeconds: 120, mistakes: [] },
      t1,
    );
    expect(reviewed.summary.accuracy).toBe(1);
    expect(reviewed.state.counters.reviewSessions).toBe(1);
    for (const w of Object.values(reviewed.state.words)) {
      expect(w.repetitions).toBe(2);
      expect(w.intervalDays).toBe(3);
    }
    expect(reviewed.summary.strengthenedWordIds.length).toBeGreaterThan(0);
  });

  it("brings a missed word back within minutes and counts a lapse", () => {
    const t1 = T0 + DAY + 5 * MINUTE;
    const words = learnedWords(first.state, t1);
    const { exercises } = buildReviewExercises(words, new Set(), "seed");
    const failed = applySession(
      first.state,
      { kind: "review", answers: simulateAnswers(exercises, { allCorrect: false }), introducedVocabIds: [], seenGrammarIds: [], durationSeconds: 60, mistakes: [] },
      t1,
    );
    for (const w of Object.values(failed.state.words)) {
      expect(w.lapses).toBe(1);
      expect(w.nextReview - t1).toBe(10 * MINUTE);
      expect(w.timesIncorrect).toBeGreaterThan(0);
    }
  });

  it("extends the streak on consecutive days and forgives a single rest day", () => {
    const day2 = applySession(first.state, lessonPayload(ALL_LESSONS[1].id), T0 + DAY);
    expect(day2.summary.streak).toMatchObject({ current: 2, increased: true });
    const day4 = applySession(day2.state, lessonPayload(ALL_LESSONS[2].id), T0 + 3 * DAY); // skipped day 3
    expect(day4.summary.streak.current).toBe(3);
    expect(streakOf(day4.state, T0 + 3 * DAY).longest).toBe(3);
  });

  it("pays half the completion XP when a lesson is repeated", () => {
    const repeat = applySession(first.state, lessonPayload(lesson1.id), T0 + 2 * DAY);
    expect(repeat.summary.xpTotal).toBeLessThan(first.summary.xpTotal);
    expect(repeat.summary.isFirstCompletion).toBe(false);
    expect(repeat.state.lessons[lesson1.id].timesCompleted).toBe(2);
  });

  it("tracks grammar mastery from practice", () => {
    const withGrammar = ALL_LESSONS.find((l) => grammarTaught(l).length > 0)!;
    const { state } = applySession(onboarded(), lessonPayload(withGrammar.id), T0);
    for (const g of grammarTaught(withGrammar)) expect(state.grammar[g]).toBeDefined();
    expect(Object.values(state.grammar).some((g) => g.attempts > 0)).toBe(true);
  });

  it("keeps XP and daily activity consistent", () => {
    const { state } = first;
    expect(state.activity[dateKey(T0)].xp).toBe(state.totalXp);
    expect(achievementsOf(state, T0).filter((a) => a.unlocked).length).toBe(Object.keys(state.achievements).length);
  });
});
