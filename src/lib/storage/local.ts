import { migrateState } from "./migrations";
import type { LearnerRepository } from "./repository";

const key = (userId: string) => `habla:learner:${userId}`;
const backupKey = (userId: string) => `habla:learner:${userId}:corrupt-backup`;

/** localStorage-backed repository. Every access is guarded: storage can be blocked or full. */
export const localRepository: LearnerRepository = {
  load(userId) {
    try {
      const raw = window.localStorage.getItem(key(userId));
      if (!raw) return null;
      try {
        const migrated = migrateState(JSON.parse(raw), userId);
        if (migrated) return migrated;
      } catch {
        /* fall through to backup */
      }
      window.localStorage.setItem(backupKey(userId), raw);
      return null;
    } catch {
      return null;
    }
  },
  save(state) {
    try {
      window.localStorage.setItem(key(state.userId), JSON.stringify(state));
    } catch {
      /* quota exceeded or storage blocked — progress stays in memory this session */
    }
  },
  clear(userId) {
    try {
      window.localStorage.removeItem(key(userId));
    } catch {
      /* ignore */
    }
  },
};

export const storageKeyFor = key;
