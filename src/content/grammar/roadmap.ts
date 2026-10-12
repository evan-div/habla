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
  planned("past-perfect", "Past perfect", "Había hablado — what had already happened."),
  planned("imperfect-subjunctive", "Imperfect subjunctive", "Si tuviera… — hypothetical “if I had…”."),
  planned("se-impersonal", "Impersonal and passive se", "Se habla español — how things are done."),
];
