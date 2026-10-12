import { STATE_VERSION, createInitialState } from "@/lib/state/initial";
import type { LearnerState } from "@/lib/state/types";

/**
 * Bring stored data up to the current schema. Unknown or corrupt data returns
 * null so the caller can start fresh (after backing the raw value up).
 */
export function migrateState(raw: unknown, userId: string): LearnerState | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<LearnerState>;
  if (typeof data.version !== "number" || data.version > STATE_VERSION) return null;

  // Merge over defaults so newly added fields never come back undefined.
  const base = createInitialState(userId);
  return {
    ...base,
    ...data,
    version: STATE_VERSION,
    profile: { ...base.profile, ...data.profile },
    settings: { ...base.settings, ...data.settings },
    counters: { ...base.counters, ...data.counters },
    dojo: { ...base.dojo, ...data.dojo },
    words: data.words ?? {},
    grammar: data.grammar ?? {},
    lessons: data.lessons ?? {},
    activity: data.activity ?? {},
    achievements: data.achievements ?? {},
  } as LearnerState;
}
