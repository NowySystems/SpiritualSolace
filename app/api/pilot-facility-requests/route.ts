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

const requestSelect = "id,support_options,safe_context_note,status,facility_approved_at,partner_assigned_at,partner_outcome,requester_update,requester_update_released_at,created_at,updated_at" as const;
const allowedSupport = new Set<SupportOption>(["Prayer", "Friendly visit", "Encouragement", "Pastoral call"]);
const allowedActions = new Set(["approve", "release_update"]);

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

function cleanSupport(value: unknown) {
  if (!Array.isArray(value)) return [] as SupportOption[];
  return value.filter((item): item is SupportOption => typeof item === "string" && allowedSupport.has(item as SupportOption));
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
    support: cleanSupport(row.support_options),
    safe_note: row.safe_context_note ?? "",
    status: workspaceStage(row.status),
    raw_status: row.status,
    facility_review_status: facilityApproved ? "approved" : "pending",
    partner_assignment_status: partnerReported ? "reported" : row.partner_assigned_at ? "assigned" : "pending",
    requester_update_status: row.requester_update_released_at ? "released" : "pending",
    partner_outcome: row.partner_outcome,
    requester_update: row.requester_update,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function GET() {
  const session = await getPilotRoleSession("facility");
  if (!session.ok) return json(session.status, session);

  const { data, error } = await session.supabase
    .from("churchwork_pilot_requests")
    .select(requestSelect)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return json(503, {
      ok: false,
      code: "facility-queue-unavailable",
      message: "The facility review queue is temporarily unavailable."
    });
  }

  return json(200, {
    ok: true,
    requests: ((data ?? []) as PilotRequestRow[]).map(toWorkspaceRequest)
  });
}

export async function POST(request: NextRequest) {
  const session = await getPilotRoleSession("facility");
  if (!session.ok) return json(session.status, session);

  const payload = await request.json().catch(() => null);
  const requestId = typeof payload?.requestId === "string" ? payload.requestId : "";
  const action = typeof payload?.action === "string" ? payload.action : "";

  if (!requestId || !allowedActions.has(action)) {
    return json(400, {
      ok: false,
      code: "bad-facility-action",
      message: "Choose a valid facility action for a saved pilot request."
    });
  }

  const { error: actionError } = await session.supabase.rpc("facility_advance_churchwork_pilot_request", {
    p_request_id: requestId,
    p_action: action
  });

  if (actionError) {
    return json(409, {
      ok: false,
      code: "facility-action-rejected",
      message: action === "approve"
        ? "This request could not be approved in its current state."
        : "This requester update is not ready to release yet."
    });
  }

  const { data, error: reloadError } = await session.supabase
    .from("churchwork_pilot_requests")
    .select(requestSelect)
    .eq("id", requestId)
    .single();

  if (reloadError || !data) {
    return json(200, {
      ok: true,
      message: action === "approve" ? "Request approved for Hope Church." : "Requester update released."
    });
  }

  return json(200, {
    ok: true,
    request: toWorkspaceRequest(data as PilotRequestRow),
    message: action === "approve" ? "Request approved for Hope Church." : "Requester update released."
  });
}
