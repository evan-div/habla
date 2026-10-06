"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getNowFor, learnerStore } from "./store";
import type { LearnerState, TranslationSupport } from "./types";

const TICK_MS = 30_000;

/* One shared clock tick so "due" counts refresh while the app stays open. */
let tick = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const tickListeners = new Set<() => void>();

function subscribeTick(listener: () => void) {
  tickListeners.add(listener);
  if (!timer) {
    tick = Date.now();
    timer = setInterval(() => {
      tick = Date.now();
      tickListeners.forEach((l) => l());
    }, TICK_MS);
  }
  return () => {
    tickListeners.delete(listener);
    if (tickListeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
const getTick = () => {
  if (tick === 0) tick = Date.now();
  return tick;
};

/** The learner's state, or null until it has loaded on the client. */
export function useLearnerState(): LearnerState | null {
  return useSyncExternalStore(learnerStore.subscribe, learnerStore.getSnapshot, learnerStore.getServerSnapshot);
}

/** "Now" in ms, honoring the developer clock offset; 0 before hydration. */
export function useNow(): number {
  const state = useLearnerState();
  const t = useSyncExternalStore(subscribeTick, getTick, () => 0);
  return useMemo(() => (t === 0 ? 0 : t + (state?.clockOffsetMs ?? 0)), [t, state?.clockOffsetMs]);
}

export interface Learner {
  state: LearnerState;
  now: number;
}

/** State + now, or null while loading. Most screens branch on this. */
export function useLearner(): Learner | null {
  const state = useLearnerState();
  const now = useNow();
  return useMemo(() => (state && now ? { state, now } : null), [state, now]);
}

/** The learner's English-support level (defaults to full before state loads). */
export function useTranslationSupport(): TranslationSupport {
  return useLearnerState()?.settings.translationSupport ?? "full";
}

export { getNowFor };
