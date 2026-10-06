import { getCurrentUser } from "@/lib/auth/session";
import { localRepository } from "@/lib/storage/local";
import type { LearnerRepository } from "@/lib/storage/repository";
import { applySession } from "./commit";
import { createInitialState } from "./initial";
import type { LearnerState, SessionPayload, SessionSummary } from "./types";

/**
 * A tiny external store (consumed with useSyncExternalStore). It lazily loads
 * from the repository on first client read, so server rendering and the first
 * hydration pass see `null` (not ready) and nothing mismatches.
 */
let repository: LearnerRepository = localRepository;
let state: LearnerState | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function ensureLoaded(): LearnerState | null {
  if (typeof window === "undefined") return null;
  if (!loaded) {
    loaded = true;
    const user = getCurrentUser();
    state = repository.load(user.id) ?? createInitialState(user.id);
  }
  return state;
}

export const learnerStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: ensureLoaded,
  getServerSnapshot: (): LearnerState | null => null,
};

export function getNowFor(s: LearnerState | null): number {
  return Date.now() + (s?.clockOffsetMs ?? 0);
}

/** Replace the whole state (and persist it). */
export function setState(next: LearnerState) {
  state = next;
  repository.save(next);
  emit();
}

/** Update the state with a pure function. No-op until the store has loaded. */
export function updateState(fn: (s: LearnerState) => LearnerState) {
  const current = ensureLoaded();
  if (current) setState(fn(current));
}

/** Commit a finished lesson/review. Returns the summary shown on the completion screen. */
export function commitSession(payload: SessionPayload): SessionSummary {
  const current = ensureLoaded();
  if (!current) throw new Error("Learner state is not available yet.");
  const { state: next, summary } = applySession(current, payload, getNowFor(current));
  setState(next);
  return summary;
}

export function resetAllProgress() {
  const user = getCurrentUser();
  repository.clear(user.id);
  setState(createInitialState(user.id));
}

/** Swap the persistence backend (used by tests and, later, cloud sync). */
export function configureRepository(next: LearnerRepository) {
  repository = next;
  loaded = false;
  state = null;
  emit();
}

/** Keep multiple tabs in sync: re-read when another tab writes. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key && event.key.startsWith("habla:learner:") && !event.key.endsWith("corrupt-backup")) {
      loaded = false;
      ensureLoaded();
      emit();
    }
  });
}
