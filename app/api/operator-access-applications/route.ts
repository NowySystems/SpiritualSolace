import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";
import { churchWorkEmailConfigured, sendChurchWorkEmail } from "@/lib/churchwork-email";

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

export async function GET() {
  try {
    const supabase = await operatorClient();
    if (!supabase) return json(401, { ok: false, message: "ChurchWork admin access required." });

    const [{ data: applications, error: appError }, { data: partners, error: partnerError }] = await Promise.all([
      supabase.rpc("list_churchwork_access_applications"),
      supabase.rpc("list_churchwork_route_partners")
    ]);

    if (appError || partnerError) {
      return json(403, { ok: false, message: "Only ChurchWork owners/platform admins can review access applications." });
    }

    return json(200, {
      ok: true,
      applications: Array.isArray(applications) ? applications : [],
      partners: Array.isArray(partners) ? partners : [],
      emailAlertsConfigured: churchWorkEmailConfigured() && Boolean(process.env.CHURCHWORK_ADMIN_ALERT_EMAIL)
    });
  } catch {
    return json(503, { ok: false, message: "ChurchWork access applications are temporarily unavailable." });
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const applicationId = typeof payload?.applicationId === "string" ? payload.applicationId : "";
  const action = payload?.action;

  if (!applicationId || (action !== "approve" && action !== "reject")) {
    return json(400, { ok: false, message: "Choose a pending application and an approval action." });
  }

  try {
    const supabase = await operatorClient();
    if (!supabase) return json(401, { ok: false, message: "ChurchWork admin access required." });

    if (action === "reject") {
      const { data, error } = await supabase.rpc("reject_churchwork_access_application", {
        p_application_id: applicationId,
        p_review_note: typeof payload?.reviewNote === "string" ? payload.reviewNote : ""
      });

      if (error || data !== true) {
        return json(409, { ok: false, message: "This application could not be rejected." });
      }

      return json(200, { ok: true, message: "Pilot access request rejected." });
    }

    const { data, error } = await supabase.rpc("approve_churchwork_access_application", {
      p_application_id: applicationId,
      p_pilot_admin: payload?.pilotAdmin === true,
      p_partner_organization_id: typeof payload?.partnerOrganizationId === "string" && payload.partnerOrganizationId ? payload.partnerOrganizationId : null
    });

    if (error || !data || typeof data !== "object") {
      return json(409, {
        ok: false,
        message: "ChurchWork could not approve this application. For a facility, make sure its care-partner route is valid."
      });
    }

    const approved = data as Record<string, unknown>;
    const applicantEmail = typeof payload?.applicantEmail === "string" ? payload.applicantEmail : "";
    const organizationName = typeof approved.organization_name === "string" ? approved.organization_name : "your organization";
    const portal = approved.portal === "facility" ? "Facility" : "Care Partner";

    let approvalEmailSent = false;
    if (applicantEmail) {
      const mail = await sendChurchWorkEmail({
        to: applicantEmail,
        subject: `ChurchWork pilot access approved: ${organizationName}`,
        text: [
          "Your ChurchWork pilot access has been approved.",
          "",
          `Organization: ${organizationName}`,
          `Portal: ${portal}`,
          `Role: ${typeof approved.role === "string" ? approved.role : "organization admin"}`,
          "",
          "Return to church-work.com and sign in with the account you created."
        ].join("\n")
      });
      approvalEmailSent = mail.sent;
    }

    return json(200, {
      ok: true,
      approved,
      approvalEmailSent,
      message: "Pilot access approved."
    });
  } catch {
    return json(503, { ok: false, message: "ChurchWork could not review this application right now." });
  }
}
