import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "./env";

export function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseServerEnv();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
