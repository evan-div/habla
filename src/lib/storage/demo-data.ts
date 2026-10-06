import { ALL_LESSONS, grammarTaught, introducedWordIds } from "@/content/course";
import { isScored } from "@/content/types";
import { recallKindOf } from "@/lib/engine/evaluate";
import { selectReviewQueue } from "@/lib/srs/queue";
import { applySession } from "@/lib/state/commit";
import type { AnswerRecord, LearnerState, SessionPayload } from "@/lib/state/types";
import { DAY, HOUR } from "@/lib/util/dates";
import { mulberry32 } from "@/lib/util/random";

const SAMPLE_LESSONS = 12;
const SAMPLE_DAYS = 13;

/**
 * Build a realistic lived-in state by replaying real sessions — lessons and the
 * reviews that follow them — through the real commit logic on back-dated days,
 * so every dashboard can be previewed. Keeps the learner's profile and settings.
 */
export function buildSampleState(base: LearnerState, now: number): LearnerState {
  const rand = mulberry32(2026);
  let state: LearnerState = {
    ...base,
    totalXp: 0,
    words: {},
    grammar: {},
    lessons: {},
    activity: {},
    achievements: {},
    counters: { reviewCardsCompleted: 0, reviewCorrect: 0, reviewSessions: 0, perfectLessons: 0, realTalkLessons: 0, dailyGoalsHit: 0 },
    clockOffsetMs: 0,
  };

  const lessons = ALL_LESSONS.slice(0, SAMPLE_LESSONS);
  // Oldest lesson ~two weeks ago, newest today; the occasional skipped day is a rest day.
  const dayOffset = (i: number) => Math.round(((lessons.length - 1 - i) * SAMPLE_DAYS) / Math.max(1, lessons.length - 1));

  lessons.forEach((lesson, i) => {
    const ts = now - dayOffset(i) * DAY;

    // Practice what's due first (like a real learner who opens Review before a lesson).
    const due = selectReviewQueue(Object.values(state.words), ts - 2 * HOUR, 12);
    if (due.length > 0) {
      const answers: AnswerRecord[] = due.map((w, k) => ({
        exerciseId: `sample-review-${i}-${w.vocabId}`,
        type: "multipleChoice",
        vocabIds: [w.vocabId],
        grammarIds: [],
        correct: rand() > 0.14,
        recall: k % 3 === 0 ? "translation" : "multipleChoice",
        retry: false,
      }));
      state = applySession(state, { kind: "review", answers, introducedVocabIds: [], seenGrammarIds: [], durationSeconds: 150, mistakes: [] }, ts - 2 * HOUR).state;
    }

    const answers: AnswerRecord[] = lesson.exercises.filter(isScored).map((ex) => {
      const correct = rand() > 0.16;
      const pairIds = ex.type === "matching" ? ex.pairs.flatMap((p) => (p.vocabId ? [p.vocabId] : [])) : [];
      return {
        exerciseId: ex.id,
        type: ex.type,
        vocabIds: ex.type === "matching" ? pairIds : (ex.vocabIds ?? []),
        grammarIds: ex.grammarIds ?? [],
        correct,
        recall: recallKindOf(ex),
        retry: false,
        missedVocabIds: ex.type === "matching" && !correct ? pairIds.slice(0, 1) : undefined,
      };
    });
    const payload: SessionPayload = {
      kind: "lesson",
      lessonId: lesson.id,
      answers,
      introducedVocabIds: introducedWordIds(lesson.exercises),
      seenGrammarIds: grammarTaught(lesson),
      durationSeconds: 300 + Math.round(rand() * 240),
      mistakes: [],
    };
    state = applySession(state, payload, ts).state;
  });

  return state;
}
