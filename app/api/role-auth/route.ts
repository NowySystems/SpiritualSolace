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
  // ChurchWork owners/platform admins may enter any portal for operator oversight
  // and demonstrations. Ordinary users remain strictly role-scoped.
  if (membershipRole === "owner" || membershipRole === "platform_admin") {
    roles.add("requester");
    roles.add("facility");
    roles.add("partner");
    return;
  }

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

async function supabaseJsAttempt(env: ReturnType<typeof getSupabaseServerEnv>, mode: AuthMode, role: RoleKey, email: string, password: string, captchaToken?: string): Promise<AuthAttempt> {
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
          options: {
            ...(role === "requester" ? { data: { churchwork_role: "requester" } } : {}),
            ...(captchaToken ? { captchaToken } : {})
          }
        })
      : await supabase.auth.signInWithPassword({
          email,
          password,
          ...(captchaToken ? { options: { captchaToken } } : {})
        });

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

async function restFallbackAttempt(env: ReturnType<typeof getSupabaseServerEnv>, mode: AuthMode, role: RoleKey, email: string, password: string, captchaToken?: string): Promise<AuthAttempt> {
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

  const security = captchaToken ? { gotrue_meta_security: { captcha_token: captchaToken } } : {};
  const requestBody = mode === "sign-up"
    ? role === "requester"
      ? { email, password, data: { churchwork_role: "requester" }, ...security }
      : { email, password, ...security }
    : { email, password, ...security };

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
  const inviteToken = typeof payload.inviteToken === "string" ? payload.inviteToken.trim() : "";
  const captchaToken = typeof payload.captchaToken === "string" ? payload.captchaToken.trim() : "";

  if (!isRole(role)) {
    return json(400, { ok: false, code: "bad-role", message: "Invalid ChurchWork role." });
  }

  if (!email || !password) {
    return json(400, { ok: false, code: "bad-credentials", message: "Email and password are required." });
  }

  if (mode === "sign-up" && password.length < 12) {
    return json(400, { ok: false, code: "weak-password", message: "New ChurchWork passwords must be at least 12 characters." });
  }

  let env: ReturnType<typeof getSupabaseServerEnv>;

  try {
    env = getSupabaseServerEnv();
  } catch (error) {
    console.error("[churchwork-role-auth] missing server auth configuration", error);
    return json(503, {
      ok: false,
      code: "auth-service-unavailable",
      message: "ChurchWork sign-in is temporarily unavailable. Please try again shortly."
    });
  }

  let inviteDetails: Record<string, unknown> | null = null;
  if (inviteToken) {
    const inviteClient = createClient(env.url, env.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    const { data: inviteData, error: inviteError } = await inviteClient.rpc("validate_churchwork_portal_invite", {
      p_token: inviteToken
    });

    if (inviteError) {
      return json(503, {
        ok: false,
        code: "invite-check-unavailable",
        message: "ChurchWork could not verify this invitation right now."
      });
    }

    inviteDetails = inviteData && typeof inviteData === "object" ? inviteData as Record<string, unknown> : null;
    if (!inviteDetails?.valid) {
      return json(410, {
        ok: false,
        code: "invite-invalid",
        message: "This ChurchWork invitation is invalid, expired, or has already been used."
      });
    }

    const invitePortal = inviteDetails.portal;
    if (
      (role === "facility" && invitePortal !== "facility")
      || (role === "partner" && invitePortal !== "partner")
      || (role === "requester" && invitePortal !== "requester")
    ) {
      return json(403, {
        ok: false,
        code: "invite-role-mismatch",
        message: "This invitation belongs to a different ChurchWork portal."
      });
    }

    if (typeof inviteDetails.email === "string" && inviteDetails.email.toLowerCase() !== email) {
      return json(403, {
        ok: false,
        code: "invite-email-mismatch",
        message: "Use the email address this ChurchWork invitation was sent to."
      });
    }
  }

  const primaryAttempt = await supabaseJsAttempt(env, mode, role, email, password, captchaToken || undefined);
  const shouldTryFallback = Boolean(primaryAttempt.error && isNetworkAuthError(primaryAttempt.error.message));
  let finalAttempt = shouldTryFallback
    ? await restFallbackAttempt(env, mode, role, email, password, captchaToken || undefined)
    : primaryAttempt;

  if (finalAttempt.error && isNetworkAuthError(finalAttempt.error.message)) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    finalAttempt = await restFallbackAttempt(env, mode, role, email, password, captchaToken || undefined);
  }

  if (finalAttempt.error || !finalAttempt.data) {
    const networkFailure = Boolean(finalAttempt.error && isNetworkAuthError(finalAttempt.error.message));

    if (networkFailure) {
      console.error("[churchwork-role-auth] authentication provider unavailable", {
        source: finalAttempt.source,
        status: finalAttempt.error?.status,
        message: finalAttempt.error?.message
      });

      return json(503, {
        ok: false,
        code: "auth-service-unavailable",
        message: "ChurchWork sign-in is temporarily unavailable. Please try again in a minute."
      });
    }

    const rejectedStatus = finalAttempt.error?.status || 401;
    const rejectedMessage = mode === "sign-in" && (rejectedStatus === 400 || rejectedStatus === 401)
      ? "Email or password is incorrect."
      : mode === "sign-up"
        ? "ChurchWork could not create that requester account. Check the email and password and try again."
        : "ChurchWork could not sign you in.";

    return json(rejectedStatus, {
      ok: false,
      code: "auth-rejected",
      message: rejectedMessage
    });
  }

  const user = finalAttempt.data.user;
  const session = finalAttempt.data.session;
  let inviteAccepted = false;

  if (inviteDetails && inviteToken && user?.id) {
    const inviteClient = createClient(env.url, env.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    const { data: accepted, error: acceptError } = await inviteClient.rpc("accept_churchwork_portal_invite", {
      p_token: inviteToken,
      p_user_id: user.id
    });

    if (acceptError || !accepted) {
      return json(409, {
        ok: false,
        code: "invite-accept-failed",
        message: "Your account was reached, but ChurchWork could not finish the invitation. Contact the pilot admin."
      });
    }
    inviteAccepted = true;
  }

  let roleVerified = (mode === "sign-up" && role === "requester" && rolesFromMetadata(user).has("requester"))
    || inviteAccepted;

  if (mode === "sign-in") {
    const roleCheck = await approvedPortalRoles(env, session?.access_token, user);

    if (roleCheck.error) {
      return json(503, {
        ok: false,
        code: "role-check-unavailable",
        message: "ChurchWork role verification is temporarily unavailable."
      });
    }

    roleVerified = roleCheck.roles.has(role) || inviteAccepted;

    if (!roleVerified && role === "requester") {
      const availableRoles = Array.from(roleCheck.roles);
      return json(403, {
        ok: false,
        code: availableRoles.length ? "wrong-role" : "role-not-assigned",
        message: availableRoles.length
          ? `This account is approved for ${availableRoles.join(" / ")} access, not requester access.`
          : "This account does not have requester access."
      });
    }
  }

  const accessPending = !roleVerified && (role === "facility" || role === "partner");

  const result = json(200, {
    ok: true,
    mode,
    role,
    email: user?.email ?? email,
    userId: user?.id ?? null,
    roleVerified,
    accessPending,
    needsEmailConfirmation: mode === "sign-up" && !session?.access_token,
    authSource: finalAttempt.source,
    message: mode === "sign-up"
      ? role === "requester"
        ? "Requester account created. Check your email if confirmation is required."
        : accessPending
          ? "Pilot account created. Complete the organization access form after email confirmation."
          : "Pilot account created."
      : inviteAccepted
        ? "Signed in and invitation accepted."
        : accessPending
          ? "Signed in. Complete or check your pilot access application."
          : "Signed in."
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
    result.cookies.set("churchwork_pending_session", "", {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0
    });
  } else if (session?.access_token && accessPending) {
    result.cookies.set("churchwork_pending_session", session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    result.cookies.set("churchwork_pending_portal", role, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8
    });
  }

  return result;
}
