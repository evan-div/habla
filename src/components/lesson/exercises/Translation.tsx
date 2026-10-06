"use client";

import { AudioButton } from "@/components/audio/AudioButton";
import type { TranslationExercise } from "@/content/types";
import { ExerciseHeading } from "./ExerciseHeading";
import { TextAnswer } from "./TextAnswer";
import type { ExerciseViewProps } from "./types";

export function Translation({ exercise, response, onRespond, evaluation }: ExerciseViewProps<TranslationExercise>) {
  const toEnglish = exercise.direction === "es-en";
  const value = response?.kind === "text" ? response.value : "";
  return (
    <div>
      <ExerciseHeading eyebrow="Translate" title={toEnglish ? "Write this in English" : "Write this in Spanish"} />
      <div className="mb-6 flex items-center gap-4 rounded-3xl bg-soft-teal p-4 sm:p-5">
        {toEnglish && <AudioButton clip={{ text: exercise.source }} size="lg" label="Hear the sentence" />}
        <p lang={toEnglish ? "es" : "en"} className="font-display text-3xl font-extrabold leading-tight">{exercise.source}</p>
      </div>
      <TextAnswer
        value={value}
        onChange={(v) => onRespond(v.trim() ? { kind: "text", value: v } : null)}
        evaluation={evaluation}
        lang={toEnglish ? "en" : "es"}
        label={toEnglish ? "Your English translation" : "Tu traducción al español"}
        placeholder={toEnglish ? "Type in English" : "Escribe en español"}
      />
    </div>
  );
}
