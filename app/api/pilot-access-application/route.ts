import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";
import { sendChurchWorkAdminAlert } from "@/lib/churchwork-email";

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

async function applicationClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_pending_session")?.value
    ?? cookieStore.get("churchwork_role_session")?.value;

  if (!token) return null;

  const env = getSupabaseServerEnv();
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

export async function GET(request: NextRequest) {
  const portal = request.nextUrl.searchParams.get("portal");
  if (!isPortal(portal)) {
    return json(400, { ok: false, message: "Choose a facility or partner portal." });
  }

  try {
    const supabase = await applicationClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in to continue your pilot application." });

    const [{ data: organizations, error: orgError }, { data: application, error: appError }] = await Promise.all([
      supabase.rpc("list_churchwork_signup_organizations", { p_portal: portal }),
      supabase.rpc("get_my_churchwork_access_application", { p_portal: portal })
    ]);

    if (orgError || appError) {
      return json(503, { ok: false, message: "ChurchWork could not load the pilot application right now." });
    }

    return json(200, {
      ok: true,
      portal,
      organizations: Array.isArray(organizations) ? organizations : [],
      application: application && typeof application === "object" ? application : {}
    });
  } catch {
    return json(503, { ok: false, message: "ChurchWork pilot applications are temporarily unavailable." });
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const portal = payload?.portal;

  if (!isPortal(portal)) {
    return json(400, { ok: false, message: "Choose a facility or partner portal." });
  }

  try {
    const supabase = await applicationClient();
    if (!supabase) return json(401, { ok: false, message: "Sign in to submit a pilot application." });

    const { data, error } = await supabase.rpc("submit_churchwork_access_application", {
      p_portal: portal,
      p_applicant_name: typeof payload?.applicantName === "string" ? payload.applicantName : "",
      p_job_title: typeof payload?.jobTitle === "string" ? payload.jobTitle : "",
      p_phone: typeof payload?.phone === "string" ? payload.phone : "",
      p_existing_organization_id: typeof payload?.existingOrganizationId === "string" && payload.existingOrganizationId ? payload.existingOrganizationId : null,
      p_organization_name: typeof payload?.organizationName === "string" ? payload.organizationName : "",
      p_address_line_1: typeof payload?.addressLine1 === "string" ? payload.addressLine1 : "",
      p_city: typeof payload?.city === "string" ? payload.city : "",
      p_state: typeof payload?.state === "string" ? payload.state : "",
      p_postal_code: typeof payload?.postalCode === "string" ? payload.postalCode : "",
      p_website: typeof payload?.website === "string" ? payload.website : "",
      p_relationship_note: typeof payload?.relationshipNote === "string" ? payload.relationshipNote : ""
    });

    if (error || !data || typeof data !== "object") {
      return json(409, {
        ok: false,
        message: "ChurchWork could not save this pilot access request. Check the organization details and try again."
      });
    }

    const application = data as Record<string, unknown>;
    const organizationName = typeof application.organization_name === "string" ? application.organization_name : "Unknown organization";
    const email = typeof application.email === "string" ? application.email : "Unknown email";

    const alert = await sendChurchWorkAdminAlert(
      `ChurchWork pilot access request: ${organizationName}`,
      [
        "A new ChurchWork pilot access request is waiting for review.",
        "",
        `Portal: ${portal === "facility" ? "Facility" : "Care Partner"}`,
        `Organization: ${organizationName}`,
        `Applicant: ${typeof payload?.applicantName === "string" ? payload.applicantName : ""}`,
        `Email: ${email}`,
        "",
        "Open ChurchWork Admin → Users & Roles → Access Requests to review it."
      ].join("\n")
    );

    return json(201, {
      ok: true,
      application,
      adminEmailSent: alert.sent,
      message: alert.sent
        ? "Pilot access request submitted. ChurchWork has notified the platform admin."
        : "Pilot access request submitted. It is visible in the ChurchWork Admin approval queue."
    });
  } catch {
    return json(503, { ok: false, message: "ChurchWork could not submit this pilot access request right now." });
  }
}
