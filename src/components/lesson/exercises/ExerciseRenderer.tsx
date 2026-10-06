"use client";

import type { ComponentType } from "react";
import type { Exercise, ExerciseType, ExerciseOf } from "@/content/types";
import { FillBlank } from "./FillBlank";
import { GrammarNote } from "./GrammarNote";
import { GrammarQuestion } from "./GrammarQuestion";
import { Listening } from "./Listening";
import { Matching } from "./Matching";
import { MultipleChoice } from "./MultipleChoice";
import { NaturalSpeech } from "./NaturalSpeech";
import { SentenceOrder } from "./SentenceOrder";
import { Translation } from "./Translation";
import type { ExerciseViewProps } from "./types";
import { VocabularyIntroduction } from "./VocabularyIntroduction";

/**
 * The lesson engine's only coupling between content and UI: exercise `type` → component.
 * Add a new exercise type to the schema, register a view here, and every lesson can use it.
 */
const REGISTRY: { [K in ExerciseType]: ComponentType<ExerciseViewProps<ExerciseOf<K>>> } = {
  vocabularyIntroduction: VocabularyIntroduction,
  grammarNote: GrammarNote,
  naturalSpeech: NaturalSpeech,
  multipleChoice: MultipleChoice,
  translation: Translation,
  fillBlank: FillBlank,
  sentenceOrder: SentenceOrder,
  matching: Matching,
  listening: Listening,
  grammar: GrammarQuestion,
};

export function ExerciseRenderer(props: ExerciseViewProps<Exercise>) {
  // The registry guarantees the component matches `exercise.type`; TypeScript can't correlate the two.
  const View = REGISTRY[props.exercise.type] as ComponentType<ExerciseViewProps<Exercise>>;
  return <View {...props} />;
}
