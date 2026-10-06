import type { LearnerState } from "@/lib/state/types";

/**
 * Where learner progress lives. The prototype uses browser storage; a cloud
 * implementation can wrap the same interface (write-through to the local copy,
 * then sync in the background) without touching the rest of the app.
 */
export interface LearnerRepository {
  load(userId: string): LearnerState | null;
  save(state: LearnerState): void;
  clear(userId: string): void;
}
