const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function requireEnvValue(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseBrowserEnv() {
  return {
    url: requireEnvValue("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL),
    anonKey: requireEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", SUPABASE_ANON_KEY)
  };
}

export function getSupabaseServerEnv() {
  return {
    url: requireEnvValue("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL),
    anonKey: requireEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", SUPABASE_ANON_KEY)
  };
}
