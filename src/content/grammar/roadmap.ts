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
  planned("vosotros", "Vosotros (Spain)", "How Spaniards say “you all”."),
  planned("voseo", "Voseo (Argentina and beyond)", "Vos tenés — the other “you”."),
  planned("idioms", "Idioms and sayings", "Más vale tarde que nunca — proverbs and figurative language."),
];
