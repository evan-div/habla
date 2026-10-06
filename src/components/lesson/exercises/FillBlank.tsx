"use client";

import { Fragment } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { Badge } from "@/components/ui/Badge";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { FillBlankExercise } from "@/content/types";
import { cn } from "@/lib/util/cn";
import { ChoiceList } from "./ChoiceList";
import { ExerciseHeading } from "./ExerciseHeading";
import { TextAnswer } from "./TextAnswer";
import type { ExerciseViewProps } from "./types";

export function FillBlank({ exercise, response, onRespond, evaluation }: ExerciseViewProps<FillBlankExercise>) {
  const value = response?.kind === "choice" || response?.kind === "text" ? response.value : "";
  const [before, ...rest] = exercise.sentence.split("___");
  const after = rest.join("___");
  const locked = evaluation !== null;
  const spokenSentence = exercise.sentence.replace("___", exercise.answer);

  // The blank mirrors whatever is chosen or typed below, so the sentence reads naturally.
  const slot = (
    <span
      className={cn(
        "mx-1 inline-block min-w-24 border-b-4 px-3 text-center",
        !locked && (value ? "border-teal-500 text-on-teal" : "border-line-strong text-faint"),
        locked && evaluation.correct && "border-leaf-500 text-on-leaf",
        locked && !evaluation.correct && "border-chili-500 text-on-chili",
      )}
    >
      {value || "\u00A0"}
    </span>
  );

  return (
    <div>
      <ExerciseHeading eyebrow="Fill in the blank" title="Complete the sentence" />
      <div className="mb-6 rounded-3xl bg-soft-teal p-5">
        <div className="flex items-start gap-4">
          {locked && <AudioButton clip={{ text: spokenSentence }} size="md" label="Hear the full sentence" />}
          <p lang="es" className="font-display text-3xl font-extrabold leading-snug sm:text-4xl">
            <Fragment>{before}</Fragment>
            {slot}
            <Fragment>{after}</Fragment>
            {exercise.hint && <Badge tone="violet" className="ml-2 align-middle">{exercise.hint}</Badge>}
          </p>
        </div>
        {exercise.translation && <TranslatedText en={exercise.translation} className="mt-2 text-[15px]" />}
      </div>

      {exercise.options ? (
        <ChoiceList
          options={exercise.options}
          value={value || null}
          onChange={(v) => onRespond({ kind: "choice", value: v })}
          evaluation={evaluation}
          label="Choose the missing word"
          grid
        />
      ) : (
        <TextAnswer
          value={value}
          onChange={(v) => onRespond(v.trim() ? { kind: "text", value: v } : null)}
          evaluation={evaluation}
          lang="es"
          label="Missing word"
          placeholder="Escribe la palabra que falta"
        />
      )}
    </div>
  );
}
