import { LOCAL_USER_ID } from "@/lib/state/initial";

/**
 * Identity seam. The prototype runs as a single local learner; when real
 * authentication arrives, resolve the signed-in user here and the storage
 * layer (keyed by user id) follows without changes elsewhere.
 */
export interface AuthUser {
  id: string;
  kind: "local" | "account";
}

export function getCurrentUser(): AuthUser {
  return { id: LOCAL_USER_ID, kind: "local" };
}
