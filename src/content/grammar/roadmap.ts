import type { GrammarConcept } from "../types";

const planned = (id: string, title: string, tagline: string): GrammarConcept => ({
  id,
  title,
  tagline,
  status: "planned",
  summary: { heading: title, body: [tagline] },
  deepDive: [],
});

/** On the roadmap. Listed so learners can see where the course is heading. */
export const ROADMAP: GrammarConcept[] = [
  planned("conditional-perfect", "Conditional perfect", "Habría ido — what would have happened."),
  planned("pluperfect-subjunctive", "Past perfect subjunctive", "Si hubiera sabido… — regrets and the unreal past."),
  planned("reported-speech", "Reported speech", "Dijo que vendría — telling what others said."),
];
