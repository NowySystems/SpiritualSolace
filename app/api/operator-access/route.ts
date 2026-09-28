import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

type OrgSlug = "churchwork" | "grandview-post-acute" | "hope-church";

type RoleName =
  | "owner"
  | "platform_admin"
  | "pilot_admin"
  | "requester"
  | "facility_admin"
  | "facility_staff"
  | "partner_admin"
  | "partner_user";

type RoleStatus = "active" | "disabled";

type SnapshotRole = {
  role?: unknown;
  status?: unknown;
  organization_slug?: unknown;
};

type SnapshotUser = {
  id?: unknown;
  roles?: unknown;
};

type OperatorSnapshot = {
  current_user_id?: unknown;
  users?: unknown;
};

const allowedRolesByOrg: Record<OrgSlug, Set<RoleName>> = {
  churchwork: new Set<RoleName>(["owner", "platform_admin", "pilot_admin", "requester"]),
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

function currentOperatorIsOwner(snapshot: unknown, fallbackUserId: string) {
  if (!snapshot || typeof snapshot !== "object") return false;

  const typedSnapshot = snapshot as OperatorSnapshot;
  const currentUserId = typeof typedSnapshot.current_user_id === "string"
    ? typedSnapshot.current_user_id
    : fallbackUserId;
  const users = Array.isArray(typedSnapshot.users) ? typedSnapshot.users as SnapshotUser[] : [];
  const currentUser = users.find((user) => user && typeof user.id === "string" && user.id === currentUserId);
  const roles = currentUser && Array.isArray(currentUser.roles) ? currentUser.roles as SnapshotRole[] : [];

  return roles.some((entry) =>
    entry?.role === "owner"
    && entry?.status === "active"
    && entry?.organization_slug === "churchwork"
  );
}

export async function POST(request: NextRequest) {
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

  const { data: operatorSnapshot, error: operatorError } = await supabase.rpc("get_churchwork_pilot_operator_snapshot");
  if (operatorError) {
    return json(403, {
      ok: false,
      code: "operator-role-required",
      message: "This account does not have active ChurchWork owner/admin access."
    });
  }

  if (role === "owner" && !currentOperatorIsOwner(operatorSnapshot, userData.user.id)) {
    return json(403, {
      ok: false,
      code: "owner-role-required",
      message: "Only an active ChurchWork owner can manage Owner access."
    });
  }

  const { error } = await supabase.rpc("set_pilot_user_role", {
    p_user_email: email,
    p_org_slug: orgSlug,
    p_role: role,
    p_status: status
  });

  if (error) {
    const errorMessage = error.message ?? "";
    const missingAccount = /has not signed up yet/i.test(errorMessage);
    const ownerRequired = /Owner access required to manage owner role/i.test(errorMessage);
    const lastOwner = /Cannot disable the last active ChurchWork owner/i.test(errorMessage);
    const roleOrgMismatch = /(roles must belong to|Platform\/requester roles must belong to)/i.test(errorMessage);

    if (missingAccount) {
      return json(409, {
        ok: false,
        code: "account-not-created",
        message: "That person must create a ChurchWork account before a role can be assigned."
      });
    }

    if (ownerRequired) {
      return json(403, {
        ok: false,
        code: "owner-role-required",
        message: "Only an active ChurchWork owner can manage Owner access."
      });
    }

    if (lastOwner) {
      return json(409, {
        ok: false,
        code: "last-owner-required",
        message: "ChurchWork must keep at least one active owner."
      });
    }

    if (roleOrgMismatch) {
      return json(400, {
        ok: false,
        code: "role-org-mismatch",
        message: "That role does not belong to the selected ChurchWork organization."
      });
    }

    return json(400, {
      ok: false,
      code: "access-change-rejected",
      message: "ChurchWork rejected that access change."
    });
  }

  return json(200, {
    ok: true,
    message: `${email} access updated for ${orgSlug}.`
  });
}
