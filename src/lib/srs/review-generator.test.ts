import { describe, expect, it } from "vitest";
import { VOCABULARY } from "@/content/vocabulary";
import { createWordProgress, masteryAt, masteryBand } from "@/lib/mastery/mastery";
import type { LearnedWord } from "@/lib/state/selectors";
import { evaluate } from "@/lib/engine/evaluate";
import { buildReviewExercises } from "./review-generator";

const NOW = 1_700_000_000_000;

function asLearned(id: string, strength: number): LearnedWord {
  const vocab = VOCABULARY.find((v) => v.id === id)!;
  const progress = { ...createWordProgress(id, "test", NOW), strength, timesSeen: 8, lastReviewed: NOW };
  const mastery = masteryAt(progress, NOW);
  return { vocab, progress, mastery, band: masteryBand(mastery), due: true };
}

describe("buildReviewExercises", () => {
  const ids = ["hola", "gracias", "ser", "estar", "tener", "hablar", "madre", "padre", "amigo", "taco", "cafe", "agua", "adios", "mexico", "tengo-anos", "que-onda"];
  const words = ids.map((id, i) => asLearned(id, [0.1, 0.5, 0.95][i % 3]));
  const known = new Set(ids);

  it("is deterministic for a seed and varies exercise types", () => {
    const a = buildReviewExercises(words, known, "seed-1");
    const b = buildReviewExercises(words, known, "seed-1");
    expect(a.exercises.map((e) => e.id)).toEqual(b.exercises.map((e) => e.id));
    expect(new Set(a.exercises.map((e) => e.type)).size).toBeGreaterThanOrEqual(3);
  });

  it("covers every word exactly once across exercises", () => {
    const { exercises } = buildReviewExercises(words, known, "seed-2");
    const covered = exercises.flatMap((e) => ("vocabIds" in e ? (e.vocabIds ?? []) : []));
    expect([...covered].sort()).toEqual([...ids].sort());
  });

  it("only produces answerable choice questions", () => {
    for (const ex of buildReviewExercises(words, known, "seed-3").exercises) {
      if ("options" in ex && ex.options && "answer" in ex) {
        expect(ex.options).toContain(ex.answer);
        expect(new Set(ex.options).size).toBe(ex.options.length);
        expect(ex.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("generates typed answers the evaluator accepts", () => {
    const strong = ["hola", "madre", "taco"].map((id) => asLearned(id, 1));
    for (const ex of buildReviewExercises(strong, new Set(), "x").exercises) {
      if (ex.type === "translation") {
        expect(evaluate(ex, { kind: "text", value: ex.answers[0] }).correct).toBe(true);
      }
    }
  });
});
