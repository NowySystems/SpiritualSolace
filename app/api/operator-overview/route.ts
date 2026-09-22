import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_operator_session")?.value
    ?? cookieStore.get("churchwork_role_session")?.value;

  if (!token) {
    return json(401, {
      ok: false,
      code: "missing-operator-session",
      message: "Sign in with a ChurchWork owner/admin account."
    });
  }

  let env: ReturnType<typeof getSupabaseServerEnv>;
  try {
    env = getSupabaseServerEnv();
  } catch {
    return json(503, {
      ok: false,
      code: "operator-overview-unavailable",
      message: "ChurchWork operator data is not configured."
    });
  }

  const supabase = createClient(env.url, env.anonKey, {
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

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return json(401, {
      ok: false,
      code: "invalid-operator-session",
      message: "Your ChurchWork operator session is no longer valid."
    });
  }

  const { data: snapshot, error } = await supabase.rpc("get_churchwork_pilot_operator_snapshot");
  if (error || !snapshot) {
    return json(403, {
      ok: false,
      code: "operator-role-required",
      message: "This account does not have active ChurchWork owner/admin access."
    });
  }

  return json(200, {
    ok: true,
    email: userData.user.email ?? null,
    diagnosticsAccessConfigured: Boolean(process.env.CHURCHWORK_INTERNAL_ACCESS_KEY?.trim()),
    snapshot
  });
}
