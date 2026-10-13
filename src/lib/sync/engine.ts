import { migrateState } from "@/lib/storage/migrations";
import type { LearnerState } from "@/lib/state/types";
import { mergeStates, statesEqual } from "./merge";

/** One row per account: the learner's whole state plus a revision counter for optimistic concurrency. */
export interface CloudRecord {
  state: unknown;
  revision: number;
}

export interface CloudStore {
  fetch(userId: string): Promise<CloudRecord | null>;
  /**
   * Write `state` only if the cloud copy is still at `expectedRevision` (null = no copy yet).
   * Returns the new revision, or null when someone else wrote first.
   */
  push(userId: string, state: LearnerState, expectedRevision: number | null): Promise<number | null>;
}

export interface LocalStore {
  get(): LearnerState | null;
  /** Replace local state with synced state without counting it as a local edit. */
  applySynced(state: LearnerState): void;
  /** Wipe this device's copy (a different account is signing in). */
  reset(): void;
  subscribe(listener: () => void): () => void;
}

/** Remembers whose progress this device holds and which cloud revision it last saw. */
export interface SyncMeta {
  owner: string | null;
  revision: number | null;
}

export interface MetaStore {
  read(): SyncMeta;
  write(meta: SyncMeta): void;
}

export type SyncStatus = "off" | "syncing" | "synced" | "offline" | "error";

export interface SyncSnapshot {
  status: SyncStatus;
  lastSyncedAt: number | null;
  message: string | null;
}

export interface SyncEngineDeps {
  cloud: CloudStore;
  local: LocalStore;
  meta: MetaStore;
  /** Quiet period after an edit before it is pushed. */
  debounceMs?: number;
  retryMs?: number;
  isOnline?: () => boolean;
}

const MAX_ATTEMPTS = 4;

export function createSyncEngine(deps: SyncEngineDeps) {
  const debounceMs = deps.debounceMs ?? 1500;
  const retryMs = deps.retryMs ?? 30_000;
  const isOnline = deps.isOnline ?? (() => (typeof navigator === "undefined" ? true : navigator.onLine));

  let userId: string | null = null;
  let snapshot: SyncSnapshot = { status: "off", lastSyncedAt: null, message: null };
  const listeners = new Set<() => void>();

  let running: Promise<void> | null = null;
  let again = false;
  let forceFull = false;
  let adoptGuest = false;
  let applying = false;
  let seenUpdatedAt = 0;
  let syncedUpdatedAt = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let unsubscribeLocal: (() => void) | null = null;

  function setSnapshot(next: SyncSnapshot) {
    snapshot = next;
    listeners.forEach((l) => l());
  }

  function clearTimers() {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (retryTimer) clearTimeout(retryTimer);
    debounceTimer = retryTimer = null;
  }

  function schedulePush() {
    if (!userId) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void run(false);
    }, debounceMs);
  }

  /** Fold `merged` into the local store, unless the learner kept practicing while we were away. */
  function applyLocally(basis: LearnerState, merged: LearnerState) {
    const current = deps.local.get();
    if (!current) return;
    let result = merged;
    if (current.updatedAt !== basis.updatedAt) {
      result = mergeStates(current, merged);
      again = true;
    }
    if (!statesEqual(result, current)) {
      applying = true;
      try {
        deps.local.applySynced(result);
      } finally {
        applying = false;
      }
    }
    seenUpdatedAt = result.updatedAt;
    if (!again) syncedUpdatedAt = result.updatedAt;
  }

  async function attempt(full: boolean) {
    const uid = userId;
    const first = deps.local.get();
    if (!uid || !first) return;

    // Fast path: nobody else has written since we last looked, so just push.
    const meta = deps.meta.read();
    if (!full && meta.owner === uid && meta.revision !== null) {
      const revision = await deps.cloud.push(uid, first, meta.revision);
      if (revision !== null) {
        deps.meta.write({ owner: uid, revision });
        syncedUpdatedAt = first.updatedAt;
        return;
      }
    }

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const remote = await deps.cloud.fetch(uid);
      const local = deps.local.get();
      if (!local) return;

      let merged = local;
      if (remote) {
        const remoteState = migrateState(remote.state, local.userId);
        if (!remoteState) throw new SyncError("Your saved progress was made by a newer version of the app. Reload to update.");
        merged = mergeStates(local, remoteState, { ignoreEpoch: adoptGuest });
        if (statesEqual(merged, remoteState)) {
          // The cloud already has everything we do.
          adoptGuest = false;
          deps.meta.write({ owner: uid, revision: remote.revision });
          applyLocally(local, merged);
          return;
        }
      }

      const revision = await deps.cloud.push(uid, merged, remote?.revision ?? null);
      if (revision === null) continue; // someone wrote between our read and write — read again
      adoptGuest = false;
      deps.meta.write({ owner: uid, revision });
      applyLocally(local, merged);
      return;
    }
    throw new SyncError("Progress changed on another device while syncing. We'll try again shortly.");
  }

  function fail(error: unknown) {
    const offline = !isOnline();
    setSnapshot({
      status: offline ? "offline" : "error",
      lastSyncedAt: snapshot.lastSyncedAt,
      message: offline ? "You're offline — changes are saved on this device and will sync when you reconnect." : messageOf(error),
    });
    if (!retryTimer && userId) {
      retryTimer = setTimeout(() => {
        retryTimer = null;
        void run(true);
      }, retryMs);
    }
  }

  function run(full: boolean): Promise<void> {
    if (!userId) return Promise.resolve();
    forceFull ||= full;
    if (running) {
      again = true;
      return running;
    }
    running = (async () => {
      setSnapshot({ ...snapshot, status: "syncing", message: null });
      try {
        do {
          again = false;
          const wantFull = forceFull;
          forceFull = false;
          await attempt(wantFull);
        } while (again && userId);
        if (userId) setSnapshot({ status: "synced", lastSyncedAt: Date.now(), message: null });
      } catch (error) {
        fail(error);
      } finally {
        running = null;
      }
    })();
    return running;
  }

  function stop() {
    userId = null;
    clearTimers();
    unsubscribeLocal?.();
    unsubscribeLocal = null;
    again = false;
    setSnapshot({ status: "off", lastSyncedAt: null, message: null });
  }

  function onLocalChange() {
    if (applying || !userId) return;
    const current = deps.local.get();
    if (current && current.updatedAt !== seenUpdatedAt) {
      seenUpdatedAt = current.updatedAt;
      schedulePush();
    }
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** Begin syncing for a signed-in account. Resolves after the first round trip. */
    start(accountId: string): Promise<void> {
      if (userId === accountId) return run(true);
      stop();
      let meta = deps.meta.read();
      if (meta.owner && meta.owner !== accountId) {
        // This device holds someone else's progress; never mix it into this account.
        deps.local.reset();
        meta = { owner: null, revision: null };
      }
      // No owner means the progress was made signed out: carry it into the account.
      adoptGuest = meta.owner === null;
      deps.meta.write({ owner: accountId, revision: meta.owner === accountId ? meta.revision : null });

      userId = accountId;
      seenUpdatedAt = deps.local.get()?.updatedAt ?? 0;
      syncedUpdatedAt = 0;
      unsubscribeLocal = deps.local.subscribe(onLocalChange);
      setSnapshot({ status: "syncing", lastSyncedAt: null, message: null });
      return run(true);
    },

    /** Stop syncing (signed out). Leaves local progress and ownership alone. */
    stop,

    /** Check the cloud for changes from other devices (tab regained focus, network came back). */
    refresh: () => run(true),

    /** Push anything pending right now. */
    flush(): Promise<void> {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      return run(false);
    },

    hasUnsynced(): boolean {
      const current = deps.local.get();
      return !!userId && !!current && current.updatedAt > syncedUpdatedAt;
    },
  };
}

export type SyncEngine = ReturnType<typeof createSyncEngine>;

export class SyncError extends Error {}

function messageOf(error: unknown): string {
  if (error instanceof SyncError) return error.message;
  return "Couldn't reach the server. Your progress is safe on this device and we'll keep trying.";
}
