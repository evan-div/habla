import { GrammarCard } from "@/components/grammar/GrammarCard";
import { getGrammar } from "@/content/grammar";
import type { GrammarNoteExercise } from "@/content/types";
import type { ExerciseViewProps } from "./types";

export function GrammarNote({ exercise }: ExerciseViewProps<GrammarNoteExercise>) {
  const concept = getGrammar(exercise.grammarId);
  if (!concept) return <p className="rounded-2xl bg-soft-chili p-4 text-on-chili">Missing grammar topic “{exercise.grammarId}”.</p>;
  return <GrammarCard concept={concept} />;
}
