import { NextRequest, NextResponse } from "next/server";
import { getSupabaseEnvReport, getSupabaseServerEnv } from "@/lib/supabase/server-env";

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

async function readSupabaseError(response: Response) {
  try {
    const body = await response.json();
    return typeof body?.msg === "string"
      ? body.msg
      : typeof body?.message === "string"
        ? body.message
        : typeof body?.error_description === "string"
          ? body.error_description
          : `Supabase auth returned ${response.status}`;
  } catch {
    return `Supabase auth returned ${response.status}`;
  }
}

function safeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown server auth error.";
}

function authEnvHint() {
  const report = getSupabaseEnvReport();

  if (!report.hasServerUrl && !report.hasNextPublicUrl) {
    return "Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in Vercel.";
  }

  if (!report.hasServerAnonKey && !report.hasNextPublicAnonKey) {
    return "Set SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.";
  }

  if ((report.hasServerUrl && !report.serverUrlLooksValid) || (report.hasNextPublicUrl && !report.nextPublicUrlLooksValid)) {
    return "Check the Supabase project URL format. It should look like https://PROJECT.supabase.co.";
  }

  if ((report.hasServerAnonKey && !report.serverAnonKeyLooksValid) || (report.hasNextPublicAnonKey && !report.nextPublicAnonKeyLooksValid)) {
    return "Check the Supabase anon key. It should be the long public anon JWT key, not the URL or project ref.";
  }

  return "Vercel has Supabase-looking env values, but the auth endpoint was not reachable from the server.";
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
    return json(403, { ok: false, code: "role-signup-blocked", message: "Only requester accounts can be created from the public pilot page. Facility and partner accounts must be approved/invited." });
  }

  let env: ReturnType<typeof getSupabaseServerEnv>;

  try {
    env = getSupabaseServerEnv();
  } catch (error) {
    return json(500, {
      ok: false,
      code: "supabase-env-invalid",
      message: safeErrorMessage(error),
      hint: authEnvHint(),
      envReport: getSupabaseEnvReport()
    });
  }

  const endpoint = mode === "sign-up"
    ? `${env.url}/auth/v1/signup`
    : `${env.url}/auth/v1/token?grant_type=password`;

  const body = mode === "sign-up"
    ? { email, password, data: { churchwork_role: role } }
    : { email, password };

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });
  } catch (error) {
    return json(502, {
      ok: false,
      code: "server-auth-fetch-failed",
      message: "Vercel/server could not reach Supabase auth.",
      hint: authEnvHint(),
      detail: safeErrorMessage(error),
      envSource: env.source,
      envReport: getSupabaseEnvReport()
    });
  }

  if (!response.ok) {
    return json(response.status, {
      ok: false,
      code: "supabase-auth-rejected",
      message: await readSupabaseError(response),
      envSource: env.source
    });
  }

  const data = await response.json();
  const user = data?.user ?? null;
  const session = data?.session ?? data;
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
    envSource: env.source,
    message: mode === "sign-up"
      ? "Requester account created. Check email confirmation settings if sign-in is not immediate."
      : "Signed in through server auth bridge."
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
