import type { GrammarConcept } from "../types";
import { FOUNDATIONS } from "./foundations";
import { VERB_CONCEPTS } from "./verbs";
import { EVERYDAY } from "./everyday";
import { PAST_CONCEPTS } from "./past";
import { CONVERSATION_CONCEPTS } from "./conversation";
import { FURTHER_CONCEPTS } from "./further";
import { NUANCE_CONCEPTS } from "./nuance";
import { FINETUNE_CONCEPTS } from "./finetune";
import { MASTERY_CONCEPTS } from "./mastery";
import { ROADMAP } from "./roadmap";

export const GRAMMAR_CONCEPTS: readonly GrammarConcept[] = [...FOUNDATIONS, ...VERB_CONCEPTS, ...EVERYDAY, ...PAST_CONCEPTS, ...CONVERSATION_CONCEPTS, ...FURTHER_CONCEPTS, ...NUANCE_CONCEPTS, ...FINETUNE_CONCEPTS, ...MASTERY_CONCEPTS, ...ROADMAP];

const BY_ID: ReadonlyMap<string, GrammarConcept> = new Map(GRAMMAR_CONCEPTS.map((g) => [g.id, g]));

export function getGrammar(id: string): GrammarConcept | undefined {
  return BY_ID.get(id);
}

export function availableGrammar(): GrammarConcept[] {
  return GRAMMAR_CONCEPTS.filter((g) => g.status === "available");
}

export function plannedGrammar(): GrammarConcept[] {
  return GRAMMAR_CONCEPTS.filter((g) => g.status === "planned");
}
