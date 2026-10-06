"use client";

import { GraduationCap } from "lucide-react";
import { getGrammar } from "@/content/grammar";
import type { GrammarExercise } from "@/content/types";
import { ChoiceList } from "./ChoiceList";
import { ExerciseHeading } from "./ExerciseHeading";
import type { ExerciseViewProps } from "./types";

export function GrammarQuestion({ exercise, response, onRespond, evaluation }: ExerciseViewProps<GrammarExercise>) {
  const value = response?.kind === "choice" ? response.value : null;
  const topic = exercise.grammarIds?.map((id) => getGrammar(id)?.title).filter(Boolean)[0];
  return (
    <div>
      <ExerciseHeading eyebrow={topic ? `Grammar · ${topic}` : "Grammar"} title={exercise.prompt} />
      {exercise.sentence && (
        <p className="mb-6 flex items-center gap-3 rounded-3xl bg-soft-violet p-5 font-display text-3xl font-extrabold">
          <GraduationCap size={28} className="shrink-0 text-violet-500" aria-hidden="true" />
          {exercise.sentence}
        </p>
      )}
      <ChoiceList
        options={exercise.options}
        value={value}
        onChange={(v) => onRespond({ kind: "choice", value: v })}
        evaluation={evaluation}
        label={exercise.prompt}
        grid
      />
    </div>
  );
}
