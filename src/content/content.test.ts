import { describe, expect, it } from "vitest";
import { ALL_LESSONS, ALL_UNITS, INTRODUCED_IN, getLesson, introducedWordIds, lessonIndex } from "./course";
import { getGrammar } from "./grammar";
import { isScored, type Exercise } from "./types";
import { VOCABULARY, getVocab } from "./vocabulary";
import { evaluate } from "@/lib/engine/evaluate";
import { perfectResponse } from "@/lib/engine/test-utils";
import { tokenize } from "@/lib/engine/normalize";
import { buildTileBank } from "@/lib/engine/tiles";

const allExercises = ALL_LESSONS.flatMap((l) => l.exercises.map((e) => ({ lesson: l, exercise: e })));
const where = (lessonId: string, e: Exercise) => `${lessonId} › ${e.id} (${e.type})`;

describe("vocabulary", () => {
  it("has unique ids and complete entries", () => {
    const ids = VOCABULARY.map((v) => v.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const v of VOCABULARY) {
      expect(v.spanish, v.id).toBeTruthy();
      expect(v.english, v.id).toBeTruthy();
      expect(v.exampleSentence, v.id).toBeTruthy();
      expect(v.exampleTranslation, v.id).toBeTruthy();
      expect(v.pronunciation, v.id).toBeTruthy();
    }
  });

  it("gives every verb a full present-tense table", () => {
    for (const v of VOCABULARY.filter((x) => x.verb)) {
      for (const p of ["yo", "tu", "el", "nosotros", "ellos"] as const) expect(v.verb!.conjugations.present[p], `${v.id}.${p}`).toBeTruthy();
    }
  });

  it("only references related words that exist", () => {
    for (const v of VOCABULARY) for (const r of v.related ?? []) expect(getVocab(r), `${v.id} → ${r}`).toBeDefined();
  });

  it("labels slang and vulgar words with a region or note", () => {
    for (const v of VOCABULARY.filter((x) => x.register === "slang" || x.register === "vulgar")) {
      expect(v.regions?.length ?? 0, v.id).toBeGreaterThan(0);
    }
  });
});

describe("course structure", () => {
  it("has unique lesson and exercise ids", () => {
    const lessonIds = ALL_LESSONS.map((l) => l.id);
    expect(lessonIds.filter((id, i) => lessonIds.indexOf(id) !== i)).toEqual([]);
    const exIds = allExercises.map((x) => x.exercise.id);
    expect(exIds.filter((id, i) => exIds.indexOf(id) !== i)).toEqual([]);
  });

  it("numbers units consecutively and links lessons to their unit", () => {
    ALL_UNITS.forEach((u, i) => expect(u.number, u.id).toBe(i + 1));
    for (const u of ALL_UNITS) for (const l of u.lessons) expect(l.unitId).toBe(u.id);
  });

  it("opens every lesson with teaching content and varies exercise types", () => {
    for (const l of ALL_LESSONS) {
      expect(l.exercises.length, l.id).toBeGreaterThanOrEqual(9);
      expect(isScored(l.exercises[0]), `${l.id} should start with a teaching card`).toBe(false);
      const types = new Set(l.exercises.filter(isScored).map((e) => e.type));
      expect(types.size, `${l.id} exercise variety`).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("exercises", () => {
  it("reference only vocabulary and grammar that exist", () => {
    for (const { lesson, exercise: e } of allExercises) {
      for (const id of e.vocabIds ?? []) expect(getVocab(id), `${where(lesson.id, e)} vocab "${id}"`).toBeDefined();
      for (const id of e.grammarIds ?? []) expect(getGrammar(id)?.status, `${where(lesson.id, e)} grammar "${id}"`).toBe("available");
      if (e.type === "vocabularyIntroduction") for (const id of e.wordIds) expect(getVocab(id), `${where(lesson.id, e)} word "${id}"`).toBeDefined();
      if (e.type === "matching") for (const p of e.pairs) expect(getVocab(p.vocabId ?? ""), `${where(lesson.id, e)} pair "${p.vocabId}"`).toBeDefined();
    }
  });

  it("are all answerable: the perfect response evaluates as correct", () => {
    for (const { lesson, exercise: e } of allExercises) {
      const response = perfectResponse(e);
      if (!response) continue;
      expect(evaluate(e, response).correct, where(lesson.id, e)).toBe(true);
    }
  });

  it("have well-formed choices", () => {
    for (const { lesson, exercise: e } of allExercises) {
      if (!("options" in e) || !e.options) continue;
      const w = where(lesson.id, e);
      expect(new Set(e.options).size, `${w} duplicate options`).toBe(e.options.length);
      expect(e.options.length, `${w} option count`).toBeGreaterThanOrEqual(2);
      expect(e.options.length, `${w} option count`).toBeLessThanOrEqual(4);
      expect(e.options, `${w} answer missing`).toContain("answer" in e ? e.answer : "");
    }
  });

  it("accept every listed alternative answer", () => {
    for (const { lesson, exercise: e } of allExercises) {
      const w = where(lesson.id, e);
      if (e.type === "translation") for (const a of e.answers) expect(evaluate(e, { kind: "text", value: a }).correct, `${w} "${a}"`).toBe(true);
      if (e.type === "sentenceOrder") for (const a of e.answers) expect(evaluate(e, { kind: "tiles", value: tokenize(a) }).correct, `${w} "${a}"`).toBe(true);
      if (e.type === "fillBlank" && !e.options) for (const a of [e.answer, ...(e.accepted ?? [])]) expect(evaluate(e, { kind: "text", value: a }).correct, `${w} "${a}"`).toBe(true);
      if (e.type === "listening" && e.mode === "type") for (const a of [e.answer, ...(e.accepted ?? [])]) expect(evaluate(e, { kind: "text", value: a }).correct, `${w} "${a}"`).toBe(true);
    }
  });

  it("have a single blank per fill-in sentence", () => {
    for (const { lesson, exercise: e } of allExercises) {
      if (e.type === "fillBlank") expect(e.sentence.split("___").length, where(lesson.id, e)).toBe(2);
    }
  });

  it("can build every accepted sentence from the tile bank", () => {
    for (const { lesson, exercise: e } of allExercises) {
      if (e.type !== "sentenceOrder") continue;
      const bank = buildTileBank(e).map((t) => t.text.toLowerCase());
      for (const answer of e.answers) {
        const pool = [...bank];
        for (const token of tokenize(answer)) {
          const i = pool.indexOf(token.toLowerCase());
          expect(i, `${where(lesson.id, e)} missing tile "${token}" for "${answer}"`).toBeGreaterThanOrEqual(0);
          pool.splice(i, 1);
        }
      }
      expect(new Set(bank).size, `${where(lesson.id, e)} ambiguous duplicate tiles are fine, but bank too small`).toBeGreaterThan(1);
    }
  });

  it("use unambiguous matching pairs", () => {
    for (const { lesson, exercise: e } of allExercises) {
      if (e.type !== "matching") continue;
      expect(e.pairs.length, where(lesson.id, e)).toBeGreaterThanOrEqual(3);
      expect(new Set(e.pairs.map((p) => p.es)).size).toBe(e.pairs.length);
      expect(new Set(e.pairs.map((p) => p.en)).size).toBe(e.pairs.length);
    }
  });
});

describe("pedagogy", () => {
  const tested = new Map<string, string[]>(); // vocabId → lessons (in order) that test it
  for (const l of ALL_LESSONS) {
    for (const e of l.exercises.filter(isScored)) {
      const ids = e.type === "matching" ? e.pairs.flatMap((p) => (p.vocabId ? [p.vocabId] : [])) : (e.vocabIds ?? []);
      for (const id of ids) tested.set(id, [...(tested.get(id) ?? []), l.id]);
    }
  }

  it("introduces every word before it is tested", () => {
    for (const [id, lessons] of tested) {
      const introducedIn = INTRODUCED_IN.get(id);
      expect(introducedIn, `"${id}" is tested but never introduced`).toBeDefined();
      for (const lid of lessons) expect(lessonIndex(lid), `"${id}" tested in ${lid} before introduced in ${introducedIn}`).toBeGreaterThanOrEqual(lessonIndex(introducedIn!));
    }
  });

  it("practices each new word at least twice in the lesson that introduces it", () => {
    const thin: string[] = [];
    for (const l of ALL_LESSONS) {
      for (const id of introducedWordIds(l.exercises)) {
        const here = (tested.get(id) ?? []).filter((x) => x === l.id).length;
        // Natural-speech cards introduce informal variants that are exposure-only.
        const viaCard = l.exercises.some((e) => e.type === "naturalSpeech" && (e.vocabIds ?? []).includes(id));
        if (!viaCard && here < 2) thin.push(`${id} in ${l.id} (${here})`);
      }
    }
    expect(thin, `introduced but practiced fewer than twice in the same lesson: ${thin.join("; ")}`).toEqual([]);
  });

  it("brings words back: every introduced word is tested in 3+ exercises overall", () => {
    const thin: string[] = [];
    for (const [id] of INTRODUCED_IN) {
      const count = tested.get(id)?.length ?? 0;
      const viaCard = ALL_LESSONS.some((l) => l.exercises.some((e) => e.type === "naturalSpeech" && (e.vocabIds ?? []).includes(id)));
      if (count < 3 && !viaCard) thin.push(`${id} (${count})`);
    }
    expect(thin, `words tested fewer than 3 times: ${thin.join(", ")}`).toEqual([]);
  });

  it("teaches each grammar note before testing that concept", () => {
    const taught = new Set<string>();
    for (const l of ALL_LESSONS) {
      for (const e of l.exercises) {
        if (e.type === "grammarNote") taught.add(e.grammarId);
        else if (isScored(e)) for (const g of e.grammarIds ?? []) expect(taught.has(g), `${where(l.id, e)} tests "${g}" before it is taught`).toBe(true);
      }
    }
  });

  it("only exists for lessons we can look up", () => {
    for (const l of ALL_LESSONS) expect(getLesson(l.id)).toBe(l);
  });
});
