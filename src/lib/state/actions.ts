import { applyPlacement } from "@/lib/placement";
import { buildSampleState } from "@/lib/storage/demo-data";
import { DAY } from "@/lib/util/dates";
import { createInitialState } from "./initial";
import { getNowFor, replaceProgress, resetAllProgress, updateState } from "./store";
import type { LearnerState, Profile, Settings } from "./types";

export function completeOnboarding(profile: Omit<Profile, "onboardedAt">) {
  updateState((s) => ({ ...s, profile: { ...profile, onboardedAt: getNowFor(s) }, profileEditedAt: Date.now() }));
}

/** Start the course at `startUnitNumber`, skipping (and adding to review) everything before it. */
export function choosePlacement(startUnitNumber: number, score: { correct: number; answered: number }) {
  updateState((s) => applyPlacement(s, startUnitNumber, score, getNowFor(s)));
}

export function updateProfile(patch: Partial<Profile>) {
  updateState((s) => ({ ...s, profile: { ...s.profile, ...patch }, profileEditedAt: Date.now() }));
}

export function updateSettings(patch: Partial<Settings>) {
  updateState((s) => ({ ...s, settings: { ...s.settings, ...patch }, settingsEditedAt: Date.now() }));
  if (patch.theme) applyTheme(patch.theme);
}

/** Mirror the theme choice into a tiny separate key the pre-paint script can read. */
export function applyTheme(theme: Settings["theme"]) {
  try {
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("habla:theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("habla:theme", theme);
    }
  } catch {
    /* storage blocked — theme still applies for this session */
  }
}

export function exportProgress(state: LearnerState): string {
  return JSON.stringify(state, null, 2);
}

/** Replace progress with an exported file. Returns an error message, or null on success. */
export async function importProgress(text: string): Promise<string | null> {
  try {
    const { migrateState } = await import("@/lib/storage/migrations");
    const parsed = migrateState(JSON.parse(text), createInitialState().userId);
    if (!parsed) return "That file doesn't look like a Habla progress export.";
    replaceProgress(parsed);
    return null;
  } catch {
    return "Couldn't read that file — is it a Habla export?";
  }
}

/* ---- Developer tools ---------------------------------------------- */

/** Pretend a day has passed, to watch spaced repetition do its thing. */
export function devAdvanceDays(days: number) {
  updateState((s) => ({ ...s, clockOffsetMs: s.clockOffsetMs + days * DAY }));
}

export function devResetClock() {
  updateState((s) => ({ ...s, clockOffsetMs: 0 }));
}

/** Replace progress with a lived-in sample so every dashboard can be previewed. */
export function devLoadSample() {
  updateState((s) => buildSampleState(s, getNowFor({ ...s, clockOffsetMs: 0 })));
}

export { resetAllProgress };
