import type { SupabaseClient } from "@supabase/supabase-js";

/** Where Supabase keeps the signed-in session in the browser. Fixed so we can tell, without loading the SDK, whether one exists. */
export const AUTH_STORAGE_KEY = "habla:auth";

// NEXT_PUBLIC_ variables are inlined at build time, so each must be referenced literally.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Accounts need a Supabase project. Without one the app runs local-only, as before. */
export const cloudConfigured = Boolean(url && key);

let client: Promise<SupabaseClient> | null = null;

/** The Supabase client, loaded on demand so people who never sign in don't download the SDK. */
export function getSupabase(): Promise<SupabaseClient> {
  if (!url || !key) return Promise.reject(new Error("Accounts aren't set up for this app yet."));
  client ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url, key, {
      auth: { storageKey: AUTH_STORAGE_KEY, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }),
  );
  return client;
}

/**
 * Cheap, synchronous check for "might this browser be signed in, or arriving from an emailed link?"
 * Lets signed-out visitors skip loading the SDK entirely.
 */
export function mightHaveSession(): boolean {
  try {
    if (window.localStorage.getItem(AUTH_STORAGE_KEY)) return true;
    const { hash, search } = window.location;
    return hash.includes("access_token") || hash.includes("error_description") || search.includes("code=");
  } catch {
    return false;
  }
}
