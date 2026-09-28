import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

function cleanEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function cleanPassword(value: unknown) {
  return typeof value === "string" ? value : "";
}

function clientForToken(url: string, anonKey: string, token: string) {
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const email = cleanEmail(payload?.email);
  const password = cleanPassword(payload?.password);

  if (!email || password.length < 8) {
    return json(400, {
      ok: false,
      code: "bad-credentials",
      message: "Enter your ChurchWork admin email and password."
    });
  }

  let env: ReturnType<typeof getSupabaseServerEnv>;
  try {
    env = getSupabaseServerEnv();
  } catch {
    return json(503, {
      ok: false,
      code: "operator-auth-unavailable",
      message: "ChurchWork operator authentication is not configured."
    });
  }

  const authClient = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  const token = data.session?.access_token;

  if (error || !token || !data.user) {
    return json(401, {
      ok: false,
      code: "operator-auth-rejected",
      message: "That ChurchWork operator sign-in did not work."
    });
  }

  const operatorClient = clientForToken(env.url, env.anonKey, token);
  const { data: snapshot, error: snapshotError } = await operatorClient.rpc("get_churchwork_pilot_operator_snapshot");

  if (snapshotError || !snapshot) {
    return json(403, {
      ok: false,
      code: "operator-role-required",
      message: "This account does not have active ChurchWork admin or Pilot Admin access."
    });
  }

  const response = json(200, {
    ok: true,
    email: data.user.email ?? email,
    message: "ChurchWork admin access verified."
  });

  response.cookies.set("churchwork_operator_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
