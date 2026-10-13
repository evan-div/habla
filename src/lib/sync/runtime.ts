import { useSyncExternalStore } from "react";
import { applySyncedState, clearLocalProgress, learnerStore } from "@/lib/state/store";
import { createSyncEngine, type LocalStore, type MetaStore, type SyncMeta, type SyncSnapshot } from "./engine";
import { supabaseCloud } from "./cloud";

const META_KEY = "habla:sync";
const EMPTY_META: SyncMeta = { owner: null, revision: null };

const meta: MetaStore = {
  read() {
    try {
      const raw = JSON.parse(window.localStorage.getItem(META_KEY) ?? "null") as Partial<SyncMeta> | null;
      if (raw && (typeof raw.owner === "string" || raw.owner === null) && (typeof raw.revision === "number" || raw.revision === null)) {
        return { owner: raw.owner ?? null, revision: raw.revision ?? null };
      }
    } catch {
      /* unreadable → treat as never synced */
    }
    return EMPTY_META;
  },
  write(next) {
    try {
      window.localStorage.setItem(META_KEY, JSON.stringify(next));
    } catch {
      /* storage blocked — the next sync just does a full read-merge-write */
    }
  },
};

const local: LocalStore = {
  get: () => learnerStore.getSnapshot(),
  applySynced: applySyncedState,
  reset: clearLocalProgress,
  subscribe: learnerStore.subscribe,
};

/** The one sync engine for this browser tab. */
export const syncEngine = createSyncEngine({ cloud: supabaseCloud, local, meta });

/** Forget which account this device's progress belongs to (after signing out). */
export function forgetSyncOwner() {
  meta.write(EMPTY_META);
}

const OFF: SyncSnapshot = { status: "off", lastSyncedAt: null, message: null };

export function useSyncStatus(): SyncSnapshot {
  return useSyncExternalStore(syncEngine.subscribe, syncEngine.getSnapshot, () => OFF);
}

/** Pick up changes from other devices when the app comes back to the foreground or the network returns. */
let triggersInstalled = false;
export function installSyncTriggers() {
  if (triggersInstalled || typeof window === "undefined") return;
  triggersInstalled = true;
  let last = 0;
  const refresh = () => {
    const now = Date.now();
    if (now - last < 10_000 || syncEngine.getSnapshot().status === "off") return;
    last = now;
    void syncEngine.refresh();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refresh();
    // Phones may freeze the page soon after it's hidden: push what we have while we still can.
    else if (syncEngine.getSnapshot().status !== "off") void syncEngine.flush();
  });
  window.addEventListener("online", () => {
    last = 0;
    refresh();
  });
}
