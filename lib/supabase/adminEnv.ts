import { requireEnvValue } from "./env";

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseAdminEnv() {
  return {
    url: requireEnvValue("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRoleKey: requireEnvValue("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY)
  };
}
