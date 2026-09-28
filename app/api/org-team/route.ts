import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";
import { sendChurchWorkEmail } from "@/lib/churchwork-email";

type Portal = "facility" | "partner";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

function isPortal(value: unknown): value is Portal {
  return value === "facility" || value === "partner";
}

async function roleClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_role_session")?.value;
  if (!token) return null;

  const env = getSupabaseServerEnv();
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

export async function GET(request: NextRequest) {
  const portal = request.nextUrl.searchParams.get("portal");
  if (!isPortal(portal)) return json(400, { ok: false, message: "Choose a facility or partner portal." });

  try {
    const supabase = await roleClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in before managing your ChurchWork team." });

    const { data, error } = await supabase.rpc("get_my_churchwork_org_team", { p_portal: portal });
    if (error || !data || typeof data !== "object") {
      return json(403, { ok: false, message: "Organization admin access is required to manage this team." });
    }

    return json(200, { ok: true, team: data });
  } catch {
    return json(503, { ok: false, message: "ChurchWork team management is temporarily unavailable." });
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const portal = payload?.portal;
  const organizationId = typeof payload?.organizationId === "string" ? payload.organizationId : "";
  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  const role = typeof payload?.role === "string" ? payload.role : "";

  if (!isPortal(portal) || !organizationId || !email || !role) {
    return json(400, { ok: false, message: "Organization, email, and role are required." });
  }

  try {
    const supabase = await roleClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in before inviting team members." });

    const { data, error } = await supabase.rpc("create_churchwork_org_invite", {
      p_organization_id: organizationId,
      p_email: email,
      p_role: role
    });

    if (error || !data || typeof data !== "object") {
      return json(403, { ok: false, message: "ChurchWork could not create that organization invitation." });
    }

    const invite = data as Record<string, unknown>;
    const token = typeof invite.token === "string" ? invite.token : "";
    const invitePortal = invite.portal === "requester" ? "requester" : invite.portal === "facility" ? "facility" : "partner";
    const path = invitePortal === "requester" ? "/requester-login" : invitePortal === "facility" ? "/facility-login" : "/partner-login";
    const inviteUrl = `${request.nextUrl.origin}${path}?invite=${encodeURIComponent(token)}`;
    const organizationName = typeof invite.organization_name === "string" ? invite.organization_name : "your organization";

    const mail = await sendChurchWorkEmail({
      to: email,
      subject: `You're invited to ChurchWork · ${organizationName}`,
      text: [
        `You've been invited to ChurchWork by ${organizationName}.`,
        "",
        `Role: ${role.replaceAll("_", " ")}`,
        "",
        "Open this secure one-time link to create or connect your ChurchWork account:",
        inviteUrl,
        "",
        "This link expires in 14 days."
      ].join("\n")
    });

    return json(201, {
      ok: true,
      invite: { ...invite, invite_url: inviteUrl },
      emailSent: mail.sent,
      message: mail.sent ? "Invitation created and emailed." : "Invitation created. Copy the link and send it to the team member."
    });
  } catch {
    return json(503, { ok: false, message: "ChurchWork could not create the team invitation right now." });
  }
}

export async function PATCH(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const portal = payload?.portal;
  const organizationId = typeof payload?.organizationId === "string" ? payload.organizationId : "";
  const userId = typeof payload?.userId === "string" ? payload.userId : "";
  const role = typeof payload?.role === "string" ? payload.role : "";
  const status = payload?.status === "disabled" ? "disabled" : "active";

  if (!isPortal(portal) || !organizationId || !userId || !role) {
    return json(400, { ok: false, message: "Organization, user, and role are required." });
  }

  try {
    const supabase = await roleClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in before managing team roles." });

    const { data, error } = await supabase.rpc("set_churchwork_org_member_role", {
      p_organization_id: organizationId,
      p_user_id: userId,
      p_role: role,
      p_status: status
    });

    if (error || data !== true) {
      return json(409, { ok: false, message: "ChurchWork could not update that team member. The last organization admin cannot remove their own admin access." });
    }

    return json(200, { ok: true, message: status === "disabled" ? "Team member disabled." : "Team member role updated." });
  } catch {
    return json(503, { ok: false, message: "ChurchWork could not update the team member right now." });
  }
}
