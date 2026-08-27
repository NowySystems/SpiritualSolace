import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

type OrgSlug = "churchwork" | "grandview-post-acute" | "hope-church";

type RoleName =
  | "owner"
  | "platform_admin"
  | "requester"
  | "facility_admin"
  | "facility_staff"
  | "partner_admin"
  | "partner_user";

type RoleStatus = "active" | "disabled";

const allowedRolesByOrg: Record<OrgSlug, Set<RoleName>> = {
  churchwork: new Set<RoleName>(["owner", "platform_admin", "requester"]),
  "grandview-post-acute": new Set<RoleName>(["facility_admin", "facility_staff"]),
  "hope-church": new Set<RoleName>(["partner_admin", "partner_user"])
};

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

function isOrg(value: unknown): value is OrgSlug {
  return value === "churchwork" || value === "grandview-post-acute" || value === "hope-church";
}

function isStatus(value: unknown): value is RoleStatus {
  return value === "active" || value === "disabled";
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_operator_session")?.value;

  if (!token) {
    return json(401, {
      ok: false,
      code: "missing-operator-session",
      message: "Sign in with a ChurchWork owner/admin account."
    });
  }

  const payload = await request.json().catch(() => null);
  const email = cleanEmail(payload?.email);
  const orgSlug = payload?.orgSlug;
  const role = payload?.role;
  const status = payload?.status;

  if (!email || !isOrg(orgSlug) || typeof role !== "string" || !isStatus(status)) {
    return json(400, {
      ok: false,
      code: "bad-access-change",
      message: "Choose an existing user, organization, role, and status."
    });
  }

  if (!allowedRolesByOrg[orgSlug].has(role as RoleName)) {
    return json(400, {
      ok: false,
      code: "role-org-mismatch",
      message: "That role does not belong to the selected ChurchWork organization."
    });
  }

  let env: ReturnType<typeof getSupabaseServerEnv>;
  try {
    env = getSupabaseServerEnv();
  } catch {
    return json(503, {
      ok: false,
      code: "operator-access-unavailable",
      message: "ChurchWork access management is not configured."
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

  const { error: operatorError } = await supabase.rpc("get_churchwork_pilot_operator_snapshot");
  if (operatorError) {
    return json(403, {
      ok: false,
      code: "operator-role-required",
      message: "This account does not have active ChurchWork owner/admin access."
    });
  }

  const { error } = await supabase.rpc("set_pilot_user_role", {
    p_user_email: email,
    p_org_slug: orgSlug,
    p_role: role,
    p_status: status
  });

  if (error) {
    const missingAccount = /has not signed up yet/i.test(error.message);
    return json(missingAccount ? 409 : 400, {
      ok: false,
      code: missingAccount ? "account-not-created" : "access-change-rejected",
      message: missingAccount
        ? "That person must create a ChurchWork account before a role can be assigned."
        : "ChurchWork rejected that access change."
    });
  }

  return json(200, {
    ok: true,
    message: `${email} access updated for ${orgSlug}.`
  });
}
