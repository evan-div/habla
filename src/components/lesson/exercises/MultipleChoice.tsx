"use client";

import { AudioButton } from "@/components/audio/AudioButton";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { DialogueLine, MultipleChoiceExercise } from "@/content/types";
import { ChoiceList } from "./ChoiceList";
import { ExerciseHeading } from "./ExerciseHeading";
import type { ExerciseViewProps } from "./types";

function Dialogue({ lines }: { lines: DialogueLine[] }) {
  return (
    <ul className="mb-5 space-y-2.5" aria-label="Conversation">
      {lines.map((line, i) => (
        <li key={i} className={`flex items-start gap-2.5 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-soft-violet text-sm font-extrabold text-on-violet" aria-hidden="true">{line.speaker[0]}</span>
          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${i % 2 === 1 ? "rounded-tr-md bg-soft-teal" : "rounded-tl-md bg-surface-2"}`}>
            <p className="text-xs font-extrabold text-muted">{line.speaker}</p>
            <p className="flex items-center gap-2 font-display text-lg font-bold">
              {line.es}
              {!line.es.includes("___") && <AudioButton clip={{ text: line.es }} size="sm" label={`Hear ${line.speaker}`} className="!h-8 !w-8" />}
            </p>
            {line.en && <TranslatedText en={line.en} className="text-sm" />}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MultipleChoice({ exercise, response, onRespond, evaluation }: ExerciseViewProps<MultipleChoiceExercise>) {
  const value = response?.kind === "choice" ? response.value : null;
  return (
    <div>
      <ExerciseHeading eyebrow="Choose the answer" title={exercise.prompt} />
      {exercise.context && <Dialogue lines={exercise.context} />}
      {exercise.focus && (
        <div className="mb-6 flex items-center gap-4 rounded-3xl bg-soft-teal p-4 sm:p-5">
          {exercise.focus.lang === "es" && <AudioButton clip={{ text: exercise.focus.text }} size="lg" label={`Hear ${exercise.focus.text}`} />}
          <p lang={exercise.focus.lang} className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{exercise.focus.text}</p>
        </div>
      )}
      <ChoiceList
        options={exercise.options}
        value={value}
        onChange={(v) => onRespond({ kind: "choice", value: v })}
        evaluation={evaluation}
        label={exercise.prompt}
      />
    </div>
  );
}
