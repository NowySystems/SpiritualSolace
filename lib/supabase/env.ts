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
  return value ? value.trim().replace(/^['\"]|['\"]$/g, "") : "";
}

function normalizeUrl(value: string, name: string) {
  const withProtocol = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin.replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid Supabase URL in ${name}. Use the full project URL, like https://PROJECT.supabase.co.`);
  }
}

function keyLooksValid(value: string) {
  return value.length >= 80 && value.includes(".");
}

function urlLooksValid(value: string) {
  try {
    normalizeUrl(value, "Supabase URL");
    return true;
  } catch {
    return false;
  }
}

function envPair(url: string | undefined, anonKey: string | undefined, urlName: string, keyName: string, source: SupabaseEnvSource): SupabaseEnv | null {
  const cleanUrl = cleanEnvValue(url);
  const cleanKey = cleanEnvValue(anonKey);

  if (!cleanUrl && !cleanKey) {
    return null;
  }

  if (!cleanUrl) {
    throw new Error(`Missing required environment variable: ${urlName}`);
  }

  if (!cleanKey) {
    throw new Error(`Missing required environment variable: ${keyName}`);
  }

  if (!keyLooksValid(cleanKey)) {
    throw new Error(`Invalid Supabase anon key in ${keyName}. Use the long public anon JWT key, not the URL or project ref.`);
  }

  return {
    url: normalizeUrl(cleanUrl, urlName),
    anonKey: cleanKey,
    source
  };
}

function getEnvPair(preferred: SupabaseEnvSource): SupabaseEnv {
  const primary = preferred === "SERVER"
    ? envPair(SERVER_SUPABASE_URL, SERVER_SUPABASE_ANON_KEY, "SUPABASE_URL", "SUPABASE_ANON_KEY", "SERVER")
    : envPair(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC");

  if (primary) {
    return primary;
  }

  const fallback = preferred === "SERVER"
    ? envPair(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC")
    : envPair(SERVER_SUPABASE_URL, SERVER_SUPABASE_ANON_KEY, "SUPABASE_URL", "SUPABASE_ANON_KEY", "SERVER");

  if (fallback) {
    return fallback;
  }

  throw new Error(
    preferred === "SERVER"
      ? "Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_ANON_KEY, or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      : "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
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
    nextPublicUrlLooksValid: publicUrl ? urlLooksValid(publicUrl) : false,
    serverUrlLooksValid: serverUrl ? urlLooksValid(serverUrl) : false,
    nextPublicAnonKeyLooksValid: publicKey ? keyLooksValid(publicKey) : false,
    serverAnonKeyLooksValid: serverKey ? keyLooksValid(serverKey) : false
  };
}
