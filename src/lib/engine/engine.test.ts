import { describe, expect, it } from "vitest";
import { matchText, normalizeText, stripAccents, levenshtein } from "./normalize";
import { evaluate } from "./evaluate";
import type { Exercise } from "@/content/types";

describe("normalizeText", () => {
  it("ignores case, punctuation and extra whitespace", () => {
    expect(normalizeText("  ¿Cómo   estás?  ", "es")).toBe("cómo estás");
  });
  it("expands English contractions so I'm == I am", () => {
    expect(normalizeText("I'm hungry.", "en")).toBe(normalizeText("I am hungry", "en"));
  });
  it("keeps ñ distinct when stripping accents", () => {
    expect(stripAccents("año")).toBe("año");
    expect(stripAccents("está")).toBe("esta");
  });
});

describe("matchText", () => {
  it("accepts exact matches regardless of punctuation", () => {
    expect(matchText("me llamo ana", ["Me llamo Ana."], "es").result).toBe("exact");
  });
  it("flags accent-only mistakes in Spanish but forgives them", () => {
    expect(matchText("como estas", ["¿Cómo estás?"], "es").result).toBe("accent");
  });
  it("does not conflate ano and año", () => {
    expect(matchText("ano", ["año"], "es").result).toBe("wrong");
  });
  it("forgives a single-letter typo in longer answers", () => {
    expect(matchText("buenas tardez", ["buenas tardes"], "es").result).toBe("typo");
  });
  it("rejects short near-misses (could be a different word)", () => {
    expect(matchText("sol", ["son"], "es").result).toBe("wrong");
  });
  it("tries every accepted answer", () => {
    expect(matchText("my name is ana", ["I am called Ana", "My name is Ana"], "en").result).toBe("exact");
  });
  it("computes edit distance", () => {
    expect(levenshtein("casa", "cosa")).toBe(1);
  });
});

describe("evaluate", () => {
  const mc: Exercise = {
    id: "t1",
    type: "multipleChoice",
    prompt: "What does 'hola' mean?",
    options: ["Hello", "Goodbye"],
    answer: "Hello",
    wrongAnswerFeedback: { Goodbye: "That's adiós." },
  };
  it("scores multiple choice and surfaces tailored feedback", () => {
    expect(evaluate(mc, { kind: "choice", value: "Hello" }).correct).toBe(true);
    const wrong = evaluate(mc, { kind: "choice", value: "Goodbye" });
    expect(wrong.correct).toBe(false);
    expect(wrong.mistakeHint).toBe("That's adiós.");
  });

  const order: Exercise = {
    id: "t2",
    type: "sentenceOrder",
    direction: "en-es",
    source: "I'm from Mexico.",
    answers: ["Soy de México", "Yo soy de México"],
  };
  it("accepts alternative word orders from `answers`", () => {
    expect(evaluate(order, { kind: "tiles", value: ["Yo", "soy", "de", "México"] }).correct).toBe(true);
    expect(evaluate(order, { kind: "tiles", value: ["de", "Soy", "México"] }).correct).toBe(false);
  });

  const matching: Exercise = {
    id: "t3",
    type: "matching",
    pairs: [
      { vocabId: "a", es: "a", en: "A" },
      { vocabId: "b", es: "b", en: "B" },
    ],
  };
  it("lets matching tolerate one slip", () => {
    expect(evaluate(matching, { kind: "pairs", mistakes: 1, missedVocabIds: ["a"] }).correct).toBe(true);
    expect(evaluate(matching, { kind: "pairs", mistakes: 2, missedVocabIds: ["a", "b"] }).correct).toBe(false);
  });
});
