import { describe, expect, it } from "vitest";
import { createInitialState } from "@/lib/state/initial";
import type { LearnerState, WordProgress } from "@/lib/state/types";
import { createSyncEngine, type CloudRecord, type CloudStore, type LocalStore, type SyncMeta } from "./engine";

/** An in-memory stand-in for the Supabase table, keyed by user id. */
class FakeCloud implements CloudStore {
  rows = new Map<string, CloudRecord>();
  pushes = 0;
  /** Run once, just before the next push is evaluated — simulates another device writing in between. */
  beforePush: (() => void) | null = null;
  failNext = false;

  async fetch(userId: string) {
    if (this.failNext) {
      this.failNext = false;
      throw new Error("network down");
    }
    const row = this.rows.get(userId);
    // Round-trip through JSON like the real database does.
    return row ? { revision: row.revision, state: JSON.parse(JSON.stringify(row.state)) as unknown } : null;
  }

  async push(userId: string, state: LearnerState, expectedRevision: number | null) {
    if (this.beforePush) {
      const hook = this.beforePush;
      this.beforePush = null;
      hook();
    }
    const row = this.rows.get(userId);
    if ((row?.revision ?? null) !== expectedRevision) return null;
    this.pushes++;
    const revision = (row?.revision ?? 0) + 1;
    this.rows.set(userId, { revision, state: JSON.parse(JSON.stringify(state)) as unknown });
    return revision;
  }
}

/** One simulated browser: its own local store and metadata. */
function device(cloud: CloudStore, initial: Partial<LearnerState> = {}, meta: SyncMeta = { owner: null, revision: null }) {
  let current: LearnerState = { ...createInitialState(), ...initial };
  let storedMeta = meta;
  const listeners = new Set<() => void>();
  const local: LocalStore = {
    get: () => current,
    applySynced(next) {
      current = next;
      listeners.forEach((l) => l());
    },
    reset() {
      current = createInitialState();
    },
    subscribe(l) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
  const engine = createSyncEngine({
    cloud,
    local,
    meta: { read: () => storedMeta, write: (m) => (storedMeta = m) },
    debounceMs: 5,
    retryMs: 1_000_000,
    isOnline: () => true,
  });
  return {
    engine,
    get state() {
      return current;
    },
    get meta() {
      return storedMeta;
    },
    /** A local edit, like store.setState. */
    edit(patch: Partial<LearnerState>, at: number) {
      current = { ...current, ...patch, updatedAt: at };
      listeners.forEach((l) => l());
    },
  };
}

function word(vocabId: string, lastReviewed = 1000): WordProgress {
  return {
    vocabId, introducedInLesson: "u1-l1", createdAt: 1000, timesSeen: 1, timesCorrect: 1, timesIncorrect: 0, strength: 0.5, masteryScore: 50,
    lastReviewed, lastIncorrectAt: null, nextReview: 2000, intervalDays: 1, ease: 2.5, repetitions: 1, lapses: 0,
  };
}

const onboarded = { ...createInitialState().profile, displayName: "Ana", onboardedAt: 1 };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("sync engine", () => {
  it("carries progress made signed-out into a new account", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded, words: { a: word("a") } });

    await phone.engine.start("user-1");

    expect(phone.engine.getSnapshot().status).toBe("synced");
    const saved = cloud.rows.get("user-1")?.state as LearnerState;
    expect(Object.keys(saved.words)).toEqual(["a"]);
    expect(phone.meta).toEqual({ owner: "user-1", revision: 1 });
  });

  it("a fresh device signing in receives the account's progress and skips onboarding", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded, words: { a: word("a") }, totalXp: 20 });
    await phone.engine.start("user-1");

    const desktop = device(cloud);
    await desktop.engine.start("user-1");

    expect(desktop.state.profile.onboardedAt).toBe(1);
    expect(desktop.state.profile.displayName).toBe("Ana");
    expect(Object.keys(desktop.state.words)).toEqual(["a"]);
    expect(desktop.state.totalXp).toBe(20);
  });

  it("pushes edits after a quiet period, and the other device picks them up on refresh", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded });
    await phone.engine.start("user-1");
    const desktop = device(cloud);
    await desktop.engine.start("user-1");

    phone.edit({ words: { a: word("a", 5000) }, totalXp: 15 }, 5000);
    await wait(40);
    expect((cloud.rows.get("user-1")?.state as LearnerState).totalXp).toBe(15);

    await desktop.engine.refresh();
    expect(desktop.state.words.a).toBeDefined();
    expect(desktop.state.totalXp).toBe(15);
  });

  it("merges practice done on two devices instead of overwriting", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded });
    await phone.engine.start("user-1");
    const desktop = device(cloud);
    await desktop.engine.start("user-1");

    // Both practice while apart.
    phone.edit({ words: { onPhone: word("onPhone", 6000) } }, 6000);
    desktop.edit({ words: { onDesktop: word("onDesktop", 7000) } }, 7000);

    await phone.engine.flush();
    await desktop.engine.flush(); // stale revision → conflict → fetch, merge, push

    await phone.engine.refresh();
    for (const d of [phone, desktop]) {
      expect(Object.keys(d.state.words).sort()).toEqual(["onDesktop", "onPhone"]);
    }
    expect(Object.keys((cloud.rows.get("user-1")?.state as LearnerState).words).sort()).toEqual(["onDesktop", "onPhone"]);
  });

  it("recovers when another device writes between our read and our write", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded });
    await phone.engine.start("user-1");
    const desktop = device(cloud);
    await desktop.engine.start("user-1");

    desktop.edit({ words: { d: word("d", 9000) } }, 9000);
    phone.edit({ words: { p: word("p", 8000) } }, 8000);
    await phone.engine.flush();

    // The desktop's push lands in the middle of the phone's next full sync.
    cloud.beforePush = () => {
      cloud.rows.set("user-1", {
        revision: 99,
        state: { ...(cloud.rows.get("user-1")?.state as LearnerState), words: { x: word("x", 9500) }, updatedAt: 9500 },
      });
    };
    phone.edit({ totalXp: 3 }, 8500);
    await phone.engine.flush();

    const keys = Object.keys((cloud.rows.get("user-1")?.state as LearnerState).words).sort();
    expect(keys).toContain("x");
    expect(keys).toContain("p");
    expect(phone.engine.getSnapshot().status).toBe("synced");
  });

  it("doesn't re-push what it just pulled", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded });
    await phone.engine.start("user-1");
    const desktop = device(cloud);
    await desktop.engine.start("user-1");
    phone.edit({ totalXp: 4 }, 4000);
    await phone.engine.flush();

    const before = cloud.pushes;
    await desktop.engine.refresh();
    await wait(30);
    expect(cloud.pushes).toBe(before);
  });

  it("a reset on one device replaces progress everywhere instead of being merged back", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded, words: { a: word("a") }, totalXp: 50 });
    await phone.engine.start("user-1");
    const desktop = device(cloud);
    await desktop.engine.start("user-1");
    expect(desktop.state.totalXp).toBe(50);

    phone.edit({ ...createInitialState(), epoch: 99_000 }, 99_000);
    await phone.engine.flush();
    await desktop.engine.refresh();

    expect(desktop.state.totalXp).toBe(0);
    expect(desktop.state.words).toEqual({});
    expect(desktop.state.epoch).toBe(99_000);
  });

  it("never mixes one account's progress into another on a shared device", async () => {
    const cloud = new FakeCloud();
    const alice = device(cloud, { updatedAt: 10, profile: onboarded, words: { secret: word("secret") } });
    await alice.engine.start("alice");

    // Same browser (same local copy and metadata), different person signs in.
    const shared = device(cloud, { updatedAt: 10, profile: onboarded, words: { secret: word("secret") } }, { owner: "alice", revision: 1 });
    await shared.engine.start("bob");

    expect(shared.state.words).toEqual({});
    expect(shared.state.profile.onboardedAt).toBeNull();
    expect(Object.keys((cloud.rows.get("bob")?.state as LearnerState).words)).toEqual([]);
    expect(Object.keys((cloud.rows.get("alice")?.state as LearnerState).words)).toEqual(["secret"]);
  });

  it("keeps working offline and reports unsynced changes until it can push", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded });
    await phone.engine.start("user-1");

    cloud.failNext = true;
    phone.edit({ totalXp: 8 }, 8000);
    // Force a full pass so the failing fetch is hit.
    await phone.engine.refresh();
    expect(phone.engine.getSnapshot().status).toBe("error");
    expect(phone.engine.hasUnsynced()).toBe(true);
    expect(phone.state.totalXp).toBe(8);

    await phone.engine.flush();
    expect(phone.engine.getSnapshot().status).toBe("synced");
    expect(phone.engine.hasUnsynced()).toBe(false);
    expect((cloud.rows.get("user-1")?.state as LearnerState).totalXp).toBe(8);
  });

  it("stops syncing on sign-out but leaves local progress alone", async () => {
    const cloud = new FakeCloud();
    const phone = device(cloud, { updatedAt: 10, profile: onboarded, words: { a: word("a") } });
    await phone.engine.start("user-1");
    phone.engine.stop();

    phone.edit({ totalXp: 2 }, 2000);
    await wait(30);

    expect(phone.engine.getSnapshot().status).toBe("off");
    expect((cloud.rows.get("user-1")?.state as LearnerState).totalXp).toBe(0);
    expect(phone.state.words.a).toBeDefined();
  });
});
