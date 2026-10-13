import { LOCAL_USER_ID } from "@/lib/state/initial";

/**
 * Identity of the local progress record. Progress is always stored under one
 * local learner on this device; signing in (see ./account.ts) additionally
 * syncs that record to the account via lib/sync.
 */
export interface AuthUser {
  id: string;
  kind: "local" | "account";
}

export function getCurrentUser(): AuthUser {
  return { id: LOCAL_USER_ID, kind: "local" };
}
