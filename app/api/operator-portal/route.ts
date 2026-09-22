import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

type PortalTarget = "requester" | "facility" | "partner" | "admin";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

function isPortalTarget(value: unknown): value is PortalTarget {
  return value === "requester" || value === "facility" || value === "partner" || value === "admin";
}

async function operatorSession() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("churchwork_role_session")?.value
    ?? cookieStore.get("churchwork_operator_session")?.value;

  if (!token) {
    return { ok: false as const, status: 401, message: "No active ChurchWork session." };
  }

  const env = getSupabaseServerEnv();
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
    return { ok: false as const, status: 401, message: "Your ChurchWork session is no longer valid." };
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("role_memberships")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("status", "active")
    .in("role", ["owner", "platform_admin"])
    .limit(1);

  if (membershipError) {
    return { ok: false as const, status: 503, message: "ChurchWork operator access could not be checked." };
  }

  if (!memberships?.length) {
    return { ok: false as const, status: 403, message: "Operator access required." };
  }

  return {
    ok: true as const,
    token,
    email: userData.user.email ?? null
  };
}

export async function GET() {
  try {
    const session = await operatorSession();
    if (!session.ok) {
      return json(session.status, {
        ok: false,
        isOperator: false,
        message: session.message
      });
    }

    return json(200, {
      ok: true,
      isOperator: true,
      email: session.email
    });
  } catch {
    return json(503, {
      ok: false,
      isOperator: false,
      message: "ChurchWork operator access is temporarily unavailable."
    });
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const target = payload?.target;

  if (!isPortalTarget(target)) {
    return json(400, {
      ok: false,
      code: "bad-portal-target",
      message: "Choose a valid ChurchWork portal."
    });
  }

  try {
    const session = await operatorSession();
    if (!session.ok) {
      return json(session.status, {
        ok: false,
        code: "operator-required",
        message: session.message
      });
    }

    const response = json(200, {
      ok: true,
      target,
      destination: target === "admin" ? "/admin" : "/pilot-mvp"
    });

    // Keep one Supabase access token usable across operator and role-specific
    // surfaces. Only owner/platform-admin accounts can reach this endpoint.
    response.cookies.set("churchwork_role_session", session.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    response.cookies.set("churchwork_operator_session", session.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8
    });

    if (target !== "admin") {
      response.cookies.set("churchwork_role", target, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8
      });
    }

    return response;
  } catch {
    return json(503, {
      ok: false,
      code: "portal-switch-unavailable",
      message: "ChurchWork could not switch portals right now."
    });
  }
}
