import type { Session } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { forgetSyncOwner, installSyncTriggers, syncEngine } from "@/lib/sync/runtime";
import { clearLocalProgress } from "@/lib/state/store";
import { cloudConfigured, getSupabase, mightHaveSession } from "./supabase";

/**
 * The signed-in account, if any. Progress always lives on this device first; being signed in
 * additionally syncs it to the cloud (see lib/sync) so other devices can pick it up.
 *
 * - loading:     haven't checked yet (always the server render and first paint)
 * - signed-out:  playing as a guest; progress is saved on this device only
 * - signed-in:   progress syncs to the account
 * - unavailable: no Supabase project is configured, so accounts are off
 */
export type AccountStatus = "loading" | "signed-out" | "signed-in" | "unavailable";

export interface AccountSnapshot {
  status: AccountStatus;
  userId: string | null;
  email: string | null;
}

const LOADING: AccountSnapshot = { status: "loading", userId: null, email: null };
let account: AccountSnapshot = LOADING;
const listeners = new Set<() => void>();

function setAccount(next: AccountSnapshot) {
  account = next;
  listeners.forEach((l) => l());
}

export function useAccount(): AccountSnapshot {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => account,
    () => LOADING,
  );
}

function handleSession(session: Session | null) {
  const user = session?.user;
  if (user) {
    if (account.userId !== user.id) void syncEngine.start(user.id);
    setAccount({ status: "signed-in", userId: user.id, email: user.email ?? null });
  } else if (account.status === "signed-in") {
    // Session ended (expired, or signed out elsewhere). Keep the local copy; signing back in resumes syncing.
    syncEngine.stop();
    setAccount({ status: "signed-out", userId: null, email: null });
  }
}

let attached = false;
async function attach() {
  const supabase = await getSupabase();
  if (!attached) {
    attached = true;
    // Supabase warns against calling its API from inside this callback, so hop out of it first.
    supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => handleSession(session), 0);
    });
  }
  const { data } = await supabase.auth.getSession();
  handleSession(data.session);
  if (!data.session && account.status === "loading") setAccount({ status: "signed-out", userId: null, email: null });
}

let initialised: Promise<void> | null = null;
/** Called once when the app starts. Safe to call again. */
export function initAccount(): Promise<void> {
  initialised ??= (async () => {
    if (!cloudConfigured) return setAccount({ status: "unavailable", userId: null, email: null });
    installSyncTriggers();
    // Visitors who have never signed in don't need the Supabase SDK at all.
    if (!mightHaveSession()) return setAccount({ status: "signed-out", userId: null, email: null });
    try {
      await attach();
    } catch {
      setAccount({ status: "signed-out", userId: null, email: null });
    }
  })();
  return initialised;
}

/* ---- Actions ------------------------------------------------------- */

export type AuthResult = { ok: true; needsConfirmation?: boolean } | { ok: false; error: string };

function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match. Check them and try again.";
  if (m.includes("email not confirmed")) return "Please confirm your email first — we sent you a link when you signed up.";
  if (m.includes("already registered") || m.includes("already been registered")) return "There's already an account with that email. Try logging in instead.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("password should be") || m.includes("weak password")) return "That password is too weak. Use at least 8 characters.";
  if (m.includes("same password") || m.includes("different from the old")) return "Choose a password you haven't used for this account before.";
  if (m.includes("failed to fetch") || m.includes("network")) return "Couldn't reach the server. Check your connection and try again.";
  return message;
}

async function guard(fn: () => Promise<AuthResult>): Promise<AuthResult> {
  try {
    return await fn();
  } catch (error) {
    return { ok: false, error: friendly(error instanceof Error ? error.message : "Something went wrong.") };
  }
}

const normalise = (email: string) => email.trim().toLowerCase();
const origin = () => window.location.origin;

export function signIn(email: string, password: string): Promise<AuthResult> {
  return guard(async () => {
    await attach();
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalise(email), password });
    if (error) return { ok: false, error: friendly(error.message) };
    handleSession(data.session);
    return { ok: true };
  });
}

export function signUp(email: string, password: string): Promise<AuthResult> {
  return guard(async () => {
    await attach();
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({ email: normalise(email), password, options: { emailRedirectTo: `${origin()}/` } });
    if (error) return { ok: false, error: friendly(error.message) };
    // With email confirmation on, an address that is already registered comes back as a user with no identities.
    if (data.user && data.user.identities?.length === 0) return { ok: false, error: friendly("User already registered") };
    if (data.session) {
      handleSession(data.session);
      return { ok: true };
    }
    return { ok: true, needsConfirmation: true };
  });
}

export function requestPasswordReset(email: string): Promise<AuthResult> {
  return guard(async () => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(normalise(email), { redirectTo: `${origin()}/reset-password` });
    return error ? { ok: false, error: friendly(error.message) } : { ok: true };
  });
}

export function updatePassword(password: string): Promise<AuthResult> {
  return guard(async () => {
    await attach();
    const supabase = await getSupabase();
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { ok: false, error: friendly(error.message) } : { ok: true };
  });
}

export type SignOutResult = { ok: true } | { ok: false; unsynced: true };

/**
 * Sign out of this device. Progress is pushed first; if it can't be (offline), this reports `unsynced`
 * so the caller can ask before discarding it. Signing out removes the local copy so the next person
 * on a shared device starts clean — it's all still in the account.
 */
export async function signOut(options: { force?: boolean } = {}): Promise<SignOutResult> {
  if (syncEngine.getSnapshot().status !== "off") {
    await syncEngine.flush();
    if (syncEngine.hasUnsynced() && !options.force) return { ok: false, unsynced: true };
  }
  syncEngine.stop();
  clearLocalProgress();
  forgetSyncOwner();
  setAccount({ status: "signed-out", userId: null, email: null });
  try {
    // "local" so this doesn't also sign the learner out of their other devices.
    await (await getSupabase()).auth.signOut({ scope: "local" });
  } catch {
    /* the session is dropped locally either way */
  }
  return { ok: true };
}
