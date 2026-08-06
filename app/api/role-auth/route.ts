import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

type RoleKey = "requester" | "facility" | "partner";
type AuthMode = "sign-in" | "sign-up";

const allowedRoles = new Set<RoleKey>(["requester", "facility", "partner"]);

function isRole(value: unknown): value is RoleKey {
  return typeof value === "string" && allowedRoles.has(value as RoleKey);
}

function cleanEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function cleanPassword(value: unknown) {
  return typeof value === "string" ? value : "";
}

function cleanMode(value: unknown): AuthMode {
  return value === "sign-up" ? "sign-up" : "sign-in";
}

function roleFromUser(user: { user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> } | null | undefined) {
  const userRole = user?.user_metadata?.churchwork_role;
  const appRole = user?.app_metadata?.churchwork_role;
  return typeof appRole === "string" ? appRole : typeof userRole === "string" ? userRole : null;
}

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

function authErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Supabase auth did not complete.";
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, code: "bad-json", message: "Invalid login request." });
  }

  const role = payload.role;
  const mode = cleanMode(payload.mode);
  const email = cleanEmail(payload.email);
  const password = cleanPassword(payload.password);

  if (!isRole(role)) {
    return json(400, { ok: false, code: "bad-role", message: "Invalid ChurchWork role." });
  }

  if (!email || !password || password.length < 8) {
    return json(400, { ok: false, code: "bad-credentials", message: "Email and an 8+ character password are required." });
  }

  if (mode === "sign-up" && role !== "requester") {
    return json(403, {
      ok: false,
      code: "role-signup-blocked",
      message: "Only requester accounts can be created from the public pilot page. Facility and partner accounts must be approved/invited."
    });
  }

  let env: ReturnType<typeof getSupabaseServerEnv>;

  try {
    env = getSupabaseServerEnv();
  } catch (error) {
    return json(500, {
      ok: false,
      code: "missing-env",
      message: error instanceof Error ? error.message : "Missing Supabase environment configuration."
    });
  }

  const supabase = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = mode === "sign-up"
    ? await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            churchwork_role: role
          }
        }
      })
    : await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return json(error.status || 401, {
      ok: false,
      code: "supabase-auth-rejected",
      message: authErrorMessage(error)
    });
  }

  const user = data?.user ?? null;
  const session = data?.session ?? null;
  const actualRole = roleFromUser(user);

  if (mode === "sign-in" && actualRole && actualRole !== role) {
    return json(403, {
      ok: false,
      code: "wrong-role",
      message: `This account is approved as ${actualRole}, not ${role}. Use the correct ChurchWork portal.`
    });
  }

  const result = json(200, {
    ok: true,
    mode,
    role,
    email: user?.email ?? email,
    userId: user?.id ?? null,
    roleVerified: actualRole === role,
    needsEmailConfirmation: mode === "sign-up" && !session?.access_token,
    message: mode === "sign-up"
      ? "Requester account created. Check email confirmation settings if sign-in is not immediate."
      : "Signed in through Supabase auth."
  });

  if (session?.access_token) {
    result.cookies.set("churchwork_role_session", session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    result.cookies.set("churchwork_role", role, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8
    });
  }

  return result;
}
