import type { Exercise } from "@/content/types";
import type { Evaluation, Response } from "@/lib/engine/evaluate";

export interface ExerciseViewProps<E extends Exercise = Exercise> {
  exercise: E;
  /** The learner's current (unsubmitted) answer. */
  response: Response | null;
  /** Report a draft answer. `submit: true` checks it immediately (e.g. a finished matching round). */
  onRespond: (response: Response | null, options?: { submit?: boolean }) => void;
  /** Set once the answer has been checked — views lock and show correct/incorrect states. */
  evaluation: Evaluation | null;
}
