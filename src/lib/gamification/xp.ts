import { XP_RULES } from "@/config/xp";
import type { AnswerRecord, SessionKind, XpLine } from "@/lib/state/types";

export interface XpResult {
  lines: XpLine[];
  total: number;
  accuracy: number | null;
  correctCount: number;
  totalCount: number;
}

/** Minimum scored answers before "perfect" bonuses apply. */
const PERFECT_MIN_ANSWERS = 5;

/** First attempts only — retrying a missed exercise teaches, but doesn't pay. */
export function firstAttempts(answers: AnswerRecord[]): AnswerRecord[] {
  return answers.filter((a) => !a.retry);
}

export function computeSessionXp(
  answers: AnswerRecord[],
  kind: SessionKind,
  isRepeatLesson: boolean,
): XpResult {
  const scored = firstAttempts(answers);
  const correctCount = scored.filter((a) => a.correct).length;
  const totalCount = scored.length;
  const accuracy = totalCount === 0 ? null : correctCount / totalCount;
  const lines: XpLine[] = [];

  if (correctCount > 0) {
    lines.push({ label: `${correctCount} correct ${correctCount === 1 ? "answer" : "answers"}`, xp: correctCount * XP_RULES.correctAnswer });
  }

  let run = 0;
  let bonus = 0;
  for (const a of scored) {
    run = a.correct ? run + 1 : 0;
    if (run > 0 && run % XP_RULES.streakBonus.every === 0) bonus += XP_RULES.streakBonus.bonus;
  }
  if (bonus > 0) lines.push({ label: "Answer streak bonus", xp: bonus });

  const factor = kind === "lesson" && isRepeatLesson ? XP_RULES.repeatLessonFactor : 1;
  const perfect = accuracy === 1 && totalCount >= PERFECT_MIN_ANSWERS;

  if (kind === "lesson") {
    lines.push({
      label: isRepeatLesson ? "Lesson practiced" : "Lesson complete",
      xp: Math.round(XP_RULES.lessonComplete * factor),
    });
    if (perfect) lines.push({ label: "Perfect lesson", xp: Math.round(XP_RULES.perfectLesson * factor) });
  } else {
    lines.push({ label: kind === "review" ? "Review complete" : "Practice complete", xp: XP_RULES.reviewSession });
    if (perfect) lines.push({ label: "Perfect review", xp: XP_RULES.perfectReview });
  }

  return { lines, total: lines.reduce((sum, l) => sum + l.xp, 0), accuracy, correctCount, totalCount };
}

export function isPerfect(accuracy: number | null, totalCount: number): boolean {
  return accuracy === 1 && totalCount >= PERFECT_MIN_ANSWERS;
}
