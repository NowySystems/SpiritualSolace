import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

type OrgSlug = "grandview-post-acute" | "hope-church";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

async function operatorClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_operator_session")?.value
    ?? cookieStore.get("churchwork_role_session")?.value;

  if (!token) return null;

  const env = getSupabaseServerEnv();
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

function cleanEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function validOrg(value: unknown): value is OrgSlug {
  return value === "grandview-post-acute" || value === "hope-church";
}

export async function GET() {
  try {
    const supabase = await operatorClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in with a ChurchWork owner/admin account." });

    const { data, error } = await supabase.rpc("list_churchwork_portal_invites");
    if (error) return json(403, { ok: false, message: "Only ChurchWork owners/platform admins can manage invitations." });

    return json(200, { ok: true, invites: Array.isArray(data) ? data : [] });
  } catch {
    return json(503, { ok: false, message: "ChurchWork invitations are temporarily unavailable." });
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const email = cleanEmail(payload?.email);
  const orgSlug = payload?.orgSlug;
  const role = typeof payload?.role === "string" ? payload.role : "";
  const pilotAdmin = payload?.pilotAdmin === true;

  if (!email || !validOrg(orgSlug)) {
    return json(400, { ok: false, message: "Enter an email and choose a pilot organization." });
  }

  const validRole = orgSlug === "grandview-post-acute"
    ? role === "facility_admin" || role === "facility_staff"
    : role === "partner_admin" || role === "partner_user";

  if (!validRole) return json(400, { ok: false, message: "Choose a role that belongs to that organization." });

  try {
    const supabase = await operatorClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in with a ChurchWork owner/admin account." });

    const { data, error } = await supabase.rpc("create_churchwork_portal_invite", {
      p_email: email,
      p_org_slug: orgSlug,
      p_role: role,
      p_pilot_admin: pilotAdmin
    });

    if (error || !data || typeof data !== "object") {
      return json(403, { ok: false, message: "ChurchWork could not create that invitation." });
    }

    const invite = data as Record<string, unknown>;
    const token = typeof invite.token === "string" ? invite.token : "";
    const portal = invite.portal === "facility" ? "facility" : "partner";
    const path = portal === "facility" ? "/facility-login" : "/partner-login";
    const inviteUrl = `${request.nextUrl.origin}${path}?invite=${encodeURIComponent(token)}`;

    return json(200, { ok: true, invite: { ...invite, invite_url: inviteUrl } });
  } catch {
    return json(503, { ok: false, message: "ChurchWork invitations are temporarily unavailable." });
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const inviteId = typeof payload?.inviteId === "string" ? payload.inviteId : "";
  if (!inviteId) return json(400, { ok: false, message: "Choose an invitation to revoke." });

  try {
    const supabase = await operatorClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in with a ChurchWork owner/admin account." });

    const { data, error } = await supabase.rpc("revoke_churchwork_portal_invite", { p_invite_id: inviteId });
    if (error || data !== true) return json(409, { ok: false, message: "That invitation could not be revoked." });

    return json(200, { ok: true, message: "Invitation revoked." });
  } catch {
    return json(503, { ok: false, message: "ChurchWork invitations are temporarily unavailable." });
  }
}
