import { createClient, type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

export type PilotPortalRole = "requester" | "facility" | "partner";

type MembershipRow = {
  role: string;
};

function addMetadataRoles(roles: Set<PilotPortalRole>, user: User) {
  const appRole = user.app_metadata?.churchwork_role;
  const userRole = user.user_metadata?.churchwork_role;

  if (appRole === "requester" || appRole === "facility" || appRole === "partner") {
    roles.add(appRole);
  }

  // Requester signup is intentionally public. Never trust user-editable metadata
  // to grant facility or partner access.
  if (userRole === "requester") {
    roles.add("requester");
  }
}

function addMembershipRole(roles: Set<PilotPortalRole>, membershipRole: string) {
  // ChurchWork owners/platform admins may enter any portal for operator oversight
  // and demonstrations. Database access remains enforced by the same privileged
  // role plus the pilot state machine; ordinary users retain strict role scoping.
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

export async function getPilotRoleSession(requiredRole: PilotPortalRole) {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_role_session")?.value;

  if (!token) {
    return {
      ok: false as const,
      status: 401,
      code: "missing-session",
      message: "Sign in before using this ChurchWork pilot workspace."
    };
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
  const user = userData.user;

  if (userError || !user) {
    return {
      ok: false as const,
      status: 401,
      code: "invalid-session",
      message: "Your ChurchWork session is no longer valid. Sign in again."
    };
  }

  const roles = new Set<PilotPortalRole>();
  addMetadataRoles(roles, user);

  const { data: memberships, error: membershipError } = await supabase
    .from("role_memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (membershipError) {
    return {
      ok: false as const,
      status: 503,
      code: "role-check-unavailable",
      message: "ChurchWork role verification is temporarily unavailable."
    };
  }

  for (const membership of (memberships ?? []) as MembershipRow[]) {
    addMembershipRole(roles, membership.role);
  }

  if (!roles.has(requiredRole)) {
    return {
      ok: false as const,
      status: 403,
      code: `${requiredRole}-role-required`,
      message: `This account does not have active ${requiredRole} pilot access.`
    };
  }

  return {
    ok: true as const,
    supabase,
    user
  };
}
