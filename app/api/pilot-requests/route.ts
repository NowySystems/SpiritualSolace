import { NextRequest, NextResponse } from "next/server";
import { getPilotRoleSession } from "@/lib/pilot-role-session";

type SupportOption = "Prayer" | "Friendly visit" | "Encouragement" | "Pastoral call";
type PilotRequestStatus =
  | "draft"
  | "facility_review"
  | "approved_for_partner"
  | "partner_outcome_logged"
  | "requester_updated"
  | "closed";

type PilotRequestRow = {
  id: string;
  facility_id: string;
  partner_id: string;
  support_options: SupportOption[] | null;
  safe_context_note: string | null;
  status: PilotRequestStatus;
  facility_approved_at: string | null;
  partner_assigned_at: string | null;
  partner_outcome: string | null;
  requester_update: string | null;
  requester_update_released_at: string | null;
  created_at: string;
  updated_at: string;
};

const allowedSupport = new Set<SupportOption>(["Prayer", "Friendly visit", "Encouragement", "Pastoral call"]);
const requestSelect = "id,facility_id,partner_id,support_options,safe_context_note,status,facility_approved_at,partner_assigned_at,partner_outcome,requester_update,requester_update_released_at,created_at,updated_at" as const;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Pilot request operation did not complete.";
}

function cleanSupport(value: unknown) {
  if (!Array.isArray(value)) return [] as SupportOption[];

  return value.filter((item): item is SupportOption => typeof item === "string" && allowedSupport.has(item as SupportOption));
}

function structuredSafeSummary(support: SupportOption[]) {
  return `Requested spiritual-care support: ${support.join(", ")}.`;
}

function workspaceStage(status: PilotRequestStatus) {
  if (status === "approved_for_partner") return "partner_assignment";
  if (status === "partner_outcome_logged" || status === "requester_updated") return "care_complete";
  return status;
}

function toWorkspaceRequest(row: PilotRequestRow) {
  const facilityApproved = Boolean(row.facility_approved_at) || [
    "approved_for_partner",
    "partner_outcome_logged",
    "requester_updated",
    "closed"
  ].includes(row.status);

  const partnerReported = Boolean(row.partner_outcome) || [
    "partner_outcome_logged",
    "requester_updated",
    "closed"
  ].includes(row.status);

  return {
    id: row.id,
    facility_id: row.facility_id,
    partner_id: row.partner_id,
    support: cleanSupport(row.support_options),
    safe_note: row.safe_context_note ?? "",
    status: workspaceStage(row.status),
    raw_status: row.status,
    facility_review_status: facilityApproved ? "approved" : "pending",
    partner_assignment_status: partnerReported ? "reported" : row.partner_assigned_at ? "assigned" : "pending",
    requester_update_status: row.requester_update_released_at ? "released" : "pending",
    partner_outcome: row.requester_update_released_at ? row.partner_outcome : null,
    requester_update: row.requester_update_released_at ? row.requester_update : null,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function GET() {
  try {
    const session = await getPilotRoleSession("requester");
    if (!session.ok) return json(session.status, session);

    const { data, error: listError } = await session.supabase
      .from("churchwork_pilot_requests")
      .select(requestSelect)
      .order("created_at", { ascending: false })
      .limit(10);

    if (listError) {
      return json(503, {
        ok: false,
        code: "pilot-request-store-unavailable",
        message: "Pilot request storage is temporarily unavailable."
      });
    }

    const { data: requesterFacilities, error: facilityError } = await session.supabase.rpc("get_my_requester_facilities");

    if (facilityError) {
      return json(503, {
        ok: false,
        code: "requester-facilities-unavailable",
        message: "ChurchWork could not verify your facility access right now."
      });
    }

    const facilities = Array.isArray(requesterFacilities) ? requesterFacilities as Array<Record<string, unknown>> : [];
    const requests = ((data ?? []) as PilotRequestRow[]).map((row) => {
      const mapped = toWorkspaceRequest(row);
      const facility = facilities.find((item) => item.facility_id === row.facility_id);
      return {
        ...mapped,
        facility_name: typeof facility?.facility_name === "string" ? facility.facility_name : null,
        partner_name: typeof facility?.partner_name === "string" ? facility.partner_name : null
      };
    });

    return json(200, {
      ok: true,
      current_user_id: session.user.id,
      requests,
      requester_facilities: facilities
    });
  } catch (error) {
    return json(500, { ok: false, code: "pilot-request-list-failed", message: errorMessage(error) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);
    const support = cleanSupport(payload?.support);
    const noMedicalAck = payload?.noMedicalAck === true;
    const facilityId = typeof payload?.facilityId === "string" && payload.facilityId ? payload.facilityId : null;

    if (support.length === 0) {
      return json(400, { ok: false, code: "support-required", message: "Choose at least one spiritual-care support option." });
    }

    if (!noMedicalAck) {
      return json(400, {
        ok: false,
        code: "no-medical-ack-required",
        message: "Confirm that this request does not contain medical, emergency, insurance, chart, or treatment information."
      });
    }

    const session = await getPilotRoleSession("requester");
    if (!session.ok) return json(session.status, session);

    const submittedAt = new Date().toISOString();
    const safeNote = structuredSafeSummary(support);
    const { data, error: insertError } = await session.supabase
      .from("churchwork_pilot_requests")
      .insert({
        requester_user_id: session.user.id,
        requester_email: session.user.email ?? null,
        facility_id: facilityId,
        support_options: support,
        safe_context_note: safeNote,
        status: "facility_review",
        activity_log: [
          {
            event: "request_submitted",
            actor: "requester",
            at: submittedAt,
            no_medical_info_acknowledged: true
          }
        ]
      })
      .select(requestSelect)
      .single();

    if (insertError) {
      const detail = insertError.message ?? "";
      if (/not linked to a facility|Choose a facility|does not have an active ChurchWork care partner/i.test(detail)) {
        return json(409, {
          ok: false,
          code: "request-routing-not-ready",
          message: detail.includes("active ChurchWork care partner")
            ? "Your facility does not have an active ChurchWork care-partner route yet."
            : detail.includes("Choose a facility")
              ? "Choose which approved facility this request belongs to."
              : "Your requester account is not linked to an approved facility yet."
        });
      }

      return json(503, {
        ok: false,
        code: "pilot-request-save-unavailable",
        message: "Pilot request storage is temporarily unavailable."
      });
    }

    return json(201, {
      ok: true,
      request: toWorkspaceRequest(data as PilotRequestRow),
      message: "Request saved and sent to facility review."
    });
  } catch (error) {
    return json(500, { ok: false, code: "pilot-request-save-failed", message: errorMessage(error) });
  }
}
