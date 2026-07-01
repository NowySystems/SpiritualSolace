import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv, getSupabaseServerEnv } from "./env";

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

export function createSupabaseAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
