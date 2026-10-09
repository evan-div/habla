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
  planned("object-pronouns", "Object pronouns", "Me, te, lo, la — replacing nouns in a sentence."),
  planned("future", "Future tense", "Hablaré, comeré — what will happen."),
  planned("conditional", "Conditional", "Would — polite and hypothetical language."),
  planned("subjunctive", "Subjunctive", "Wishes, doubts and “I hope that…”."),
  planned("reflexive-verbs", "Reflexive verbs", "Me levanto, te llamas — actions on yourself."),
  planned("commands", "Commands", "Giving instructions and polite orders."),
  planned("comparisons", "Comparisons", "Más que, menos que, tan… como."),
  planned("prepositions", "Prepositions", "En, a, de, con, sin and friends."),
];
