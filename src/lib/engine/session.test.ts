import { describe, expect, it } from "vitest";
import type { Exercise } from "@/content/types";
import { currentItem, initSession, sessionReducer, type SessionState } from "./session";

const intro: Exercise = { id: "i", type: "vocabularyIntroduction", wordIds: ["hola"], vocabIds: ["hola"] };
const q = (id: string, answer = "A"): Exercise => ({ id, type: "multipleChoice", prompt: "?", options: ["A", "B"], answer, vocabIds: ["hola"] });

function run(state: SessionState, ...actions: Parameters<typeof sessionReducer>[1][]) {
  return actions.reduce(sessionReducer, state);
}

describe("session reducer", () => {
  it("walks teaching → question → feedback → done and records introductions", () => {
    let s = initSession([intro, q("q1")]);
    s = run(s, { type: "continue" });
    expect(s.introducedVocabIds).toEqual(["hola"]);
    s = run(s, { type: "respond", response: { kind: "choice", value: "A" } }, { type: "check" });
    expect(s.phase).toBe("feedback");
    expect(s.evaluation?.correct).toBe(true);
    s = run(s, { type: "continue" });
    expect(s.phase).toBe("done");
    expect(s.answers).toHaveLength(1);
  });

  it("re-queues a missed exercise once, and not again if missed twice", () => {
    let s = initSession([q("q1")]);
    s = run(s, { type: "respond", response: { kind: "choice", value: "B" } }, { type: "check" }, { type: "continue" });
    expect(s.queue).toHaveLength(2);
    expect(currentItem(s)?.retry).toBe(true);
    s = run(s, { type: "respond", response: { kind: "choice", value: "B" } }, { type: "check" }, { type: "continue" });
    expect(s.queue).toHaveLength(2);
    expect(s.phase).toBe("done");
    expect(s.mistakes).toHaveLength(1);
    expect(s.answers.map((a) => a.retry)).toEqual([false, true]);
  });

  it("'I don't know' counts as a miss and reveals the answer", () => {
    let s = initSession([q("q1")]);
    s = run(s, { type: "skip" });
    expect(s.phase).toBe("feedback");
    expect(s.evaluation?.correct).toBe(false);
    expect(s.evaluation?.correctAnswer).toBe("A");
  });

  it("ignores check without a response", () => {
    const s = run(initSession([q("q1")]), { type: "check" });
    expect(s.phase).toBe("answering");
  });

  it("tracks the correct-answer streak", () => {
    let s = initSession([q("q1"), q("q2"), q("q3")]);
    for (const value of ["A", "A", "B"]) {
      s = run(s, { type: "respond", response: { kind: "choice", value } }, { type: "check" });
      if (value === "B") expect(s.correctStreak).toBe(0);
      s = run(s, { type: "continue" });
    }
  });
});
