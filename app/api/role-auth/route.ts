import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

type RoleKey = "requester" | "facility" | "partner";
type AuthMode = "sign-in" | "sign-up";
type AuthSource = "supabase-js" | "supabase-rest-fallback";

type AuthFailure = {
  message: string;
  status?: number;
};

type AuthSuccess = {
  user: { id?: string; email?: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> } | null;
  session: { access_token?: string } | null;
};

type AuthAttempt = {
  source: AuthSource;
  data: AuthSuccess | null;
  error: AuthFailure | null;
};

type MembershipRow = {
  role: string;
  status: string;
};

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

function rolesFromMetadata(user: AuthSuccess["user"] | null | undefined) {
  const roles = new Set<RoleKey>();
  const appRole = user?.app_metadata?.churchwork_role;
  const userRole = user?.user_metadata?.churchwork_role;

  if (isRole(appRole)) roles.add(appRole);
  if (userRole === "requester") roles.add("requester");

  return roles;
}

function addMembershipRole(roles: Set<RoleKey>, membershipRole: string) {
  if (membershipRole === "requester") roles.add("requester");
  if (membershipRole === "facility_admin" || membershipRole === "facility_staff") roles.add("facility");
  if (membershipRole === "partner_admin" || membershipRole === "partner_user") roles.add("partner");
}

async function approvedPortalRoles(
  env: ReturnType<typeof getSupabaseServerEnv>,
  token: string | undefined,
  user: AuthSuccess["user"] | null | undefined
) {
  const roles = rolesFromMetadata(user);

  if (!token || !user?.id) {
    return { roles, error: null as string | null };
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

  const { data, error } = await supabase
    .from("role_memberships")
    .select("role,status")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    return { roles, error: error.message };
  }

  for (const row of (data ?? []) as MembershipRow[]) {
    addMembershipRole(roles, row.role);
  }

  return { roles, error: null as string | null };
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

function errorName(error: unknown) {
  return error && typeof error === "object" && "name" in error && typeof error.name === "string" ? error.name : "Error";
}

function isNetworkAuthError(message: string) {
  return /fetch failed|failed to fetch|network|timeout|undici|econnreset|enotfound|etimedout/i.test(message);
}

function keyKind(key: string) {
  if (key.startsWith("sb_publishable_")) return "publishable";
  if (key.startsWith("eyJ")) return "jwt-anon";
  return "unknown";
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "invalid-url";
  }
}

function bodyMessage(body: Record<string, unknown>, fallback: string) {
  return typeof body.msg === "string"
    ? body.msg
    : typeof body.message === "string"
      ? body.message
      : typeof body.error_description === "string"
        ? body.error_description
        : typeof body.error === "string"
          ? body.error
          : fallback;
}

async function parseBody(response: Response) {
  try {
    const body = await response.json();
    return body && typeof body === "object" ? body as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function normalizeAuthData(body: Record<string, unknown>): AuthSuccess {
  const user = body.user && typeof body.user === "object" ? body.user as AuthSuccess["user"] : null;
  const sessionFromBody = body.session && typeof body.session === "object" ? body.session as AuthSuccess["session"] : null;
  const sessionFromToken = typeof body.access_token === "string" ? { access_token: body.access_token } : null;

  return {
    user,
    session: sessionFromBody ?? sessionFromToken
  };
}

async function supabaseJsAttempt(env: ReturnType<typeof getSupabaseServerEnv>, mode: AuthMode, role: RoleKey, email: string, password: string): Promise<AuthAttempt> {
  const supabase = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  try {
    const result = mode === "sign-up"
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { churchwork_role: role } }
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      return {
        source: "supabase-js",
        data: null,
        error: {
          message: authErrorMessage(result.error),
          status: result.error.status
        }
      };
    }

    return {
      source: "supabase-js",
      data: {
        user: result.data?.user ?? null,
        session: result.data?.session ?? null
      },
      error: null
    };
  } catch (error) {
    return {
      source: "supabase-js",
      data: null,
      error: {
        message: `${errorName(error)}: ${authErrorMessage(error)}`,
        status: 502
      }
    };
  }
}

async function restFallbackAttempt(env: ReturnType<typeof getSupabaseServerEnv>, mode: AuthMode, role: RoleKey, email: string, password: string): Promise<AuthAttempt> {
  const endpoint = mode === "sign-up"
    ? `${env.url}/auth/v1/signup`
    : `${env.url}/auth/v1/token?grant_type=password`;

  const headers: Record<string, string> = {
    apikey: env.anonKey,
    "Content-Type": "application/json"
  };

  if (!env.anonKey.startsWith("sb_publishable_")) {
    headers.Authorization = `Bearer ${env.anonKey}`;
  }

  const requestBody = mode === "sign-up"
    ? { email, password, data: { churchwork_role: role } }
    : { email, password };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      cache: "no-store"
    });

    const body = await parseBody(response);

    if (!response.ok) {
      return {
        source: "supabase-rest-fallback",
        data: null,
        error: {
          message: bodyMessage(body, `Supabase auth returned HTTP ${response.status}`),
          status: response.status
        }
      };
    }

    return {
      source: "supabase-rest-fallback",
      data: normalizeAuthData(body),
      error: null
    };
  } catch (error) {
    return {
      source: "supabase-rest-fallback",
      data: null,
      error: {
        message: `${errorName(error)}: ${authErrorMessage(error)}`,
        status: 502
      }
    };
  }
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

  const primaryAttempt = await supabaseJsAttempt(env, mode, role, email, password);
  const shouldTryFallback = primaryAttempt.error && isNetworkAuthError(primaryAttempt.error.message);
  const finalAttempt = shouldTryFallback
    ? await restFallbackAttempt(env, mode, role, email, password)
    : primaryAttempt;

  if (finalAttempt.error || !finalAttempt.data) {
    const primaryNote = shouldTryFallback && primaryAttempt.error
      ? ` Primary auth failed first: ${primaryAttempt.error.message}.`
      : "";
    const diagnostic = `host=${safeHost(env.url)} key=${keyKind(env.anonKey)} source=${finalAttempt.source}.`;

    return json(finalAttempt.error?.status || 401, {
      ok: false,
      code: shouldTryFallback ? "supabase-auth-fallback-failed" : "supabase-auth-rejected",
      message: `${finalAttempt.error?.message ?? "Supabase auth failed."} ${diagnostic}${primaryNote}`
    });
  }

  const user = finalAttempt.data.user;
  const session = finalAttempt.data.session;
  let roleVerified = mode === "sign-up" && role === "requester" && rolesFromMetadata(user).has("requester");

  if (mode === "sign-in") {
    const roleCheck = await approvedPortalRoles(env, session?.access_token, user);

    if (roleCheck.error) {
      return json(503, {
        ok: false,
        code: "role-check-unavailable",
        message: "ChurchWork role verification is temporarily unavailable."
      });
    }

    roleVerified = roleCheck.roles.has(role);

    if (!roleVerified) {
      const availableRoles = Array.from(roleCheck.roles);

      if (availableRoles.length === 0) {
        return json(403, {
          ok: false,
          code: "role-not-assigned",
          message: "This account does not have an active ChurchWork pilot role yet. Contact the pilot admin before signing in."
        });
      }

      return json(403, {
        ok: false,
        code: "wrong-role",
        message: `This account is approved for ${availableRoles.join(" / ")} access, not ${role}. Use the correct ChurchWork portal.`
      });
    }
  }

  if (mode === "sign-up" && session?.access_token && !roleVerified) {
    return json(500, {
      ok: false,
      code: "requester-role-setup-failed",
      message: "Requester account was created, but its pilot role could not be verified."
    });
  }

  const result = json(200, {
    ok: true,
    mode,
    role,
    email: user?.email ?? email,
    userId: user?.id ?? null,
    roleVerified,
    needsEmailConfirmation: mode === "sign-up" && !session?.access_token,
    authSource: finalAttempt.source,
    message: mode === "sign-up"
      ? "Requester account created. Check email confirmation settings if sign-in is not immediate."
      : "Signed in through Supabase auth."
  });

  if (session?.access_token && roleVerified) {
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
