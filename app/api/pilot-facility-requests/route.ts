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

type ActivityEvent = {
  event?: string;
  at?: string;
};

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
  activity_log: ActivityEvent[] | null;
  created_at: string;
  updated_at: string;
};

type RoleSession = Extract<Awaited<ReturnType<typeof getPilotRoleSession>>, { ok: true }>;
type PilotSupabase = RoleSession["supabase"];

type OwnershipRow = {
  request_id: string;
  facility_owner_user_id: string | null;
  facility_owner_name: string | null;
  facility_owner_email: string | null;
  facility_claimed_at: string | null;
  partner_owner_user_id: string | null;
  partner_owner_name: string | null;
  partner_owner_email: string | null;
  partner_claimed_at: string | null;
};

const requestSelect = "id,support_options,safe_context_note,status,facility_approved_at,partner_assigned_at,partner_outcome,requester_update,requester_update_released_at,activity_log,created_at,updated_at" as const;
const allowedSupport = new Set<SupportOption>(["Prayer", "Friendly visit", "Encouragement", "Pastoral call"]);
const allowedActions = new Set(["approve", "release_update", "claim", "release_claim"]);

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

function partnerOutcomeAt(row: PilotRequestRow) {
  const event = Array.isArray(row.activity_log)
    ? row.activity_log.find((item) => item?.event === "partner_outcome_logged" && typeof item?.at === "string")
    : null;
  return event?.at ?? (row.status === "partner_outcome_logged" ? row.updated_at : null);
}

function toWorkspaceRequest(row: PilotRequestRow, ownership?: OwnershipRow | null) {
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
    facility_approved_at: row.facility_approved_at,
    partner_assigned_at: row.partner_assigned_at,
    partner_outcome_at: partnerOutcomeAt(row),
    requester_update_released_at: row.requester_update_released_at,
    facility_owner_user_id: ownership?.facility_owner_user_id ?? null,
    facility_owner_name: ownership?.facility_owner_name ?? null,
    facility_owner_email: ownership?.facility_owner_email ?? null,
    facility_claimed_at: ownership?.facility_claimed_at ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

async function ownershipMap(
  supabase: PilotSupabase,
  ids: string[]
) {
  if (!ids.length) return new Map<string, OwnershipRow>();

  const { data } = await supabase.rpc("get_churchwork_pilot_request_ownership", {
    p_request_ids: ids
  });

  const rows = Array.isArray(data) ? data as OwnershipRow[] : [];
  return new Map(rows.map((item) => [item.request_id, item]));
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

  const rows = (data ?? []) as PilotRequestRow[];
  const owners = await ownershipMap(session.supabase, rows.map((row) => row.id));
  const { data: portalContext } = await session.supabase.rpc("get_my_churchwork_portal_context", {
    p_portal: "facility"
  });

  return json(200, {
    ok: true,
    current_user_id: session.user.id,
    portal_context: portalContext && typeof portalContext === "object" ? portalContext : {},
    requests: rows.map((row) => toWorkspaceRequest(row, owners.get(row.id)))
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

  if (action === "claim" || action === "release_claim") {
    const { error: claimError } = await session.supabase.rpc("set_churchwork_pilot_request_owner", {
      p_request_id: requestId,
      p_scope: "facility",
      p_claim: action === "claim"
    });

    if (claimError) {
      return json(409, {
        ok: false,
        code: "facility-claim-rejected",
        message: action === "claim"
          ? "This request is already claimed or is not waiting on Grandview."
          : "This Grandview claim could not be released."
      });
    }
  } else {
    const { error: actionError } = await session.supabase.rpc("facility_advance_churchwork_pilot_request", {
      p_request_id: requestId,
      p_action: action
    });

    if (actionError) {
      return json(409, {
        ok: false,
        code: "facility-action-rejected",
        message: action === "approve"
          ? "This request could not be approved. It may be claimed by another reviewer or no longer awaiting review."
          : "This requester update could not be released. It may be claimed by another reviewer or not ready yet."
      });
    }
  }

  const { data, error: reloadError } = await session.supabase
    .from("churchwork_pilot_requests")
    .select(requestSelect)
    .eq("id", requestId)
    .single();

  if (reloadError || !data) {
    return json(200, {
      ok: true,
      message: action === "claim" ? "Request claimed."
        : action === "release_claim" ? "Claim released."
        : action === "approve" ? "Request approved for Hope Church."
        : "Requester update released."
    });
  }

  const owners = await ownershipMap(session.supabase, [requestId]);

  return json(200, {
    ok: true,
    current_user_id: session.user.id,
    request: toWorkspaceRequest(data as PilotRequestRow, owners.get(requestId)),
    message: action === "claim" ? "Request claimed."
      : action === "release_claim" ? "Claim released."
      : action === "approve" ? "Request approved for Hope Church."
      : "Requester update released."
  });
}
