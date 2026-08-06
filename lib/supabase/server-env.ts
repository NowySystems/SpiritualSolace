type SupabaseServerEnv = {
  url: string;
  anonKey: string;
  source: "server" | "next-public";
};

function clean(value: string | undefined) {
  return value ? value.trim().replace(/^['\"]|['\"]$/g, "") : "";
}

function normalizeUrl(value: string, name: string) {
  const withProtocol = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin.replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid ${name}. Use the full Supabase project URL.`);
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

export function getSupabaseServerEnv(): SupabaseServerEnv {
  const serverUrl = clean(process.env.SUPABASE_URL);
  const serverKey = clean(process.env.SUPABASE_ANON_KEY);
  const publicUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publicKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const url = serverUrl || publicUrl;
  const anonKey = serverKey || publicKey;
  const source = serverUrl || serverKey ? "server" : "next-public";

  if (!url) {
    throw new Error("Missing Supabase URL. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in Vercel.");
  }

  if (!anonKey) {
    throw new Error("Missing Supabase anon key. Set SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.");
  }

  if (!keyLooksValid(anonKey)) {
    throw new Error("Invalid Supabase anon key. Use the long public anon JWT key, not the project ref or URL.");
  }

  return {
    url: normalizeUrl(url, "Supabase URL"),
    anonKey,
    source
  };
}

export function getSupabaseEnvReport() {
  const serverUrl = clean(process.env.SUPABASE_URL);
  const serverKey = clean(process.env.SUPABASE_ANON_KEY);
  const publicUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publicKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return {
    hasServerUrl: Boolean(serverUrl),
    hasServerAnonKey: Boolean(serverKey),
    hasNextPublicUrl: Boolean(publicUrl),
    hasNextPublicAnonKey: Boolean(publicKey),
    serverUrlLooksValid: serverUrl ? urlLooksValid(serverUrl) : false,
    nextPublicUrlLooksValid: publicUrl ? urlLooksValid(publicUrl) : false,
    serverAnonKeyLooksValid: serverKey ? keyLooksValid(serverKey) : false,
    nextPublicAnonKeyLooksValid: publicKey ? keyLooksValid(publicKey) : false
  };
}
