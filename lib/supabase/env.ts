const PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVER_SUPABASE_URL = process.env.SUPABASE_URL;
const SERVER_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

type SupabaseEnvSource = "NEXT_PUBLIC" | "SERVER";

type SupabaseEnv = {
  url: string;
  anonKey: string;
  source: SupabaseEnvSource;
};

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^['\"]|['\"]$/g, "");
}

function cleanSupabaseUrl(value: string | undefined, name: string) {
  const raw = cleanEnvValue(value);

  if (!raw) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  const withProtocol = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error(`Invalid Supabase URL in ${name}. Use the full project URL, like https://PROJECT.supabase.co.`);
  }

  return parsed.origin.replace(/\/$/, "");
}

function cleanSupabaseAnonKey(value: string | undefined, name: string) {
  const raw = cleanEnvValue(value);

  if (!raw) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  if (raw.length < 80 || !raw.includes(".")) {
    throw new Error(`Invalid Supabase anon key in ${name}. Use the public anon API key, not the project ref or URL.`);
  }

  return raw;
}

function getEnvPair(preferred: SupabaseEnvSource): SupabaseEnv {
  const usePublicFirst = preferred === "NEXT_PUBLIC";

  const primaryUrl = usePublicFirst ? PUBLIC_SUPABASE_URL : SERVER_SUPABASE_URL;
  const primaryKey = usePublicFirst ? PUBLIC_SUPABASE_ANON_KEY : SERVER_SUPABASE_ANON_KEY;
  const primaryUrlName = usePublicFirst ? "NEXT_PUBLIC_SUPABASE_URL" : "SUPABASE_URL";
  const primaryKeyName = usePublicFirst ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : "SUPABASE_ANON_KEY";

  const fallbackUrl = usePublicFirst ? SERVER_SUPABASE_URL : PUBLIC_SUPABASE_URL;
  const fallbackKey = usePublicFirst ? SERVER_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY;
  const fallbackUrlName = usePublicFirst ? "SUPABASE_URL" : "NEXT_PUBLIC_SUPABASE_URL";
  const fallbackKeyName = usePublicFirst ? "SUPABASE_ANON_KEY" : "NEXT_PUBLIC_SUPABASE_ANON_KEY";

  if (cleanEnvValue(primaryUrl) && cleanEnvValue(primaryKey)) {
    return {
      url: cleanSupabaseUrl(primaryUrl, primaryUrlName),
      anonKey: cleanSupabaseAnonKey(primaryKey, primaryKeyName),
      source: preferred
    };
  }

  const fallbackSource: SupabaseEnvSource = usePublicFirst ? "SERVER" : "NEXT_PUBLIC";

  return {
    url: cleanSupabaseUrl(fallbackUrl, fallbackUrlName),
    anonKey: cleanSupabaseAnonKey(fallbackKey, fallbackKeyName),
    source: fallbackSource
  };
}

export function getSupabaseBrowserEnv() {
  const env = getEnvPair("NEXT_PUBLIC");
  return {
    url: env.url,
    anonKey: env.anonKey
  };
}

export function getSupabaseServerEnv() {
  return getEnvPair("SERVER");
}

export function getSupabaseEnvReport() {
  const publicUrl = cleanEnvValue(PUBLIC_SUPABASE_URL);
  const publicKey = cleanEnvValue(PUBLIC_SUPABASE_ANON_KEY);
  const serverUrl = cleanEnvValue(SERVER_SUPABASE_URL);
  const serverKey = cleanEnvValue(SERVER_SUPABASE_ANON_KEY);

  return {
    hasNextPublicUrl: Boolean(publicUrl),
    hasNextPublicAnonKey: Boolean(publicKey),
    hasServerUrl: Boolean(serverUrl),
    hasServerAnonKey: Boolean(serverKey),
    nextPublicUrlLooksValid: Boolean(publicUrl && (() => {
      try {
        cleanSupabaseUrl(publicUrl, "NEXT_PUBLIC_SUPABASE_URL");
        return true;
      } catch {
        return false;
      }
    })()),
    serverUrlLooksValid: Boolean(serverUrl && (() => {
      try {
        cleanSupabaseUrl(serverUrl, "SUPABASE_URL");
        return true;
      } catch {
        return false;
      }
    })()),
    nextPublicAnonKeyLooksValid: Boolean(publicKey && publicKey.length >= 80 && publicKey.includes(".")),
    serverAnonKeyLooksValid: Boolean(serverKey && serverKey.length >= 80 && serverKey.includes("."))
  };
}
