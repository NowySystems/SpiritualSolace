import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

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
  requester_update_released_at: string | null;
  created_at: string;
  updated_at: string;
};

const allowedSupport = new Set<SupportOption>(["Prayer", "Friendly visit", "Encouragement", "Pastoral call"]);
const blockedTerms = [
  "diagnosis",
  "medication",
  "medicine",
  "treatment",
  "symptom",
  "insurance",
  "emergency",
  "doctor",
  "nurse",
  "pain",
  "clinical",
  "chart",
  "record"
];

const requestSelect = "id,support_options,safe_context_note,status,facility_approved_at,partner_assigned_at,partner_outcome,requester_update_released_at,created_at,updated_at" as const;

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

function cleanNote(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 1000) : "";
}

function blockedMatches(note: string) {
  const lower = note.toLowerCase();
  return blockedTerms.filter((term) => lower.includes(term));
}

function roleFromUser(user: { user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> } | null | undefined) {
  const appRole = user?.app_metadata?.churchwork_role;
  if (appRole === "requester" || appRole === "facility" || appRole === "partner") return appRole;

  const userRole = user?.user_metadata?.churchwork_role;
  return userRole === "requester" ? "requester" : null;
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
    facility_review_status: facilityApproved ? "approved" : "pending",
    partner_assignment_status: partnerReported ? "reported" : row.partner_assigned_at ? "assigned" : "pending",
    requester_update_status: row.requester_update_released_at ? "released" : "pending",
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

async function clientForSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_role_session")?.value;

  if (!token) {
    return {
      error: json(401, {
        ok: false,
        code: "missing-session",
        message: "Sign in before using the pilot request workspace."
      })
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
      error: json(401, {
        ok: false,
        code: "invalid-session",
        message: "Your ChurchWork session is no longer valid. Sign in again."
      })
    };
  }

  if (roleFromUser(user) !== "requester") {
    return {
      error: json(403, {
        ok: false,
        code: "requester-role-required",
        message: "Pilot request intake is available to requester accounts only."
      })
    };
  }

  return { supabase, user };
}

export async function GET() {
  try {
    const session = await clientForSession();
    if ("error" in session) return session.error;

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

    const requests = ((data ?? []) as PilotRequestRow[]).map(toWorkspaceRequest);
    return json(200, { ok: true, requests });
  } catch (error) {
    return json(500, { ok: false, code: "pilot-request-list-failed", message: errorMessage(error) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);
    const support = cleanSupport(payload?.support);
    const safeNote = cleanNote(payload?.safeNote);
    const matches = blockedMatches(safeNote);

    if (support.length === 0) {
      return json(400, { ok: false, code: "support-required", message: "Choose at least one spiritual-care support option." });
    }

    if (!safeNote) {
      return json(400, { ok: false, code: "note-required", message: "Add a short spiritual-care context note." });
    }

    if (matches.length > 0) {
      return json(400, {
        ok: false,
        code: "guardrail-blocked",
        message: "Remove medical, emergency, insurance, chart, or treatment details before submitting."
      });
    }

    const session = await clientForSession();
    if ("error" in session) return session.error;

    const submittedAt = new Date().toISOString();
    const { data, error: insertError } = await session.supabase
      .from("churchwork_pilot_requests")
      .insert({
        requester_user_id: session.user.id,
        requester_email: session.user.email ?? null,
        support_options: support,
        safe_context_note: safeNote,
        status: "facility_review",
        activity_log: [
          {
            event: "request_submitted",
            actor: "requester",
            at: submittedAt
          }
        ]
      })
      .select(requestSelect)
      .single();

    if (insertError) {
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
