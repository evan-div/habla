import { getSupabase } from "@/lib/auth/supabase";
import type { LearnerState } from "@/lib/state/types";
import type { CloudRecord, CloudStore } from "./engine";

const TABLE = "learner_state";
const UNIQUE_VIOLATION = "23505";

/** The `learner_state` table in Supabase (see supabase/schema.sql). Row-level security scopes every call to the signed-in user. */
export const supabaseCloud: CloudStore = {
  async fetch(userId): Promise<CloudRecord | null> {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from(TABLE).select("state, revision").eq("user_id", userId).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? { state: data.state as unknown, revision: data.revision as number } : null;
  },

  async push(userId, state: LearnerState, expectedRevision) {
    const supabase = await getSupabase();

    if (expectedRevision === null) {
      const { error } = await supabase.from(TABLE).insert({ user_id: userId, state, revision: 1 });
      if (!error) return 1;
      if (error.code === UNIQUE_VIOLATION) return null; // another device created it first
      throw new Error(error.message);
    }

    const revision = expectedRevision + 1;
    const { data, error } = await supabase
      .from(TABLE)
      .update({ state, revision, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("revision", expectedRevision)
      .select("revision");
    if (error) throw new Error(error.message);
    return data && data.length > 0 ? revision : null;
  },
};
