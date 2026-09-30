import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

type SupportOption = "Prayer" | "Friendly visit" | "Encouragement" | "Pastoral call";

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

async function clientForSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("churchwork_role_session")?.value;

  if (!token) {
    return { error: json(401, { ok: false, code: "missing-session", message: "Sign in before using the pilot request workspace." }) };
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

  return { supabase };
}

export async function GET() {
  try {
    const { supabase, error } = await clientForSession();
    if (error || !supabase) return error;

    const { data, error: listError } = await supabase
      .from("churchwork_pilot_requests")
      .select("id,support_options,safe_context_note,status,facility_approved_at,partner_assigned_at,partner_outcome,requester_update,requester_update_released_at,created_at,updated_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (listError) {
      return json(503, {
        ok: false,
        code: "pilot-request-store-unavailable",
        message: `Pilot request storage is not available yet: ${listError.message}`
      });
    }

    const requests = (data ?? []).map((item) => ({
      id: item.id,
      support: item.support_options,
      safe_note: item.safe_context_note,
      status: item.status,
      facility_review_status: item.facility_approved_at ? "approved" : "pending",
      partner_assignment_status: item.partner_outcome ? "reported" : item.partner_assigned_at ? "assigned" : "pending",
      requester_update_status: item.requester_update_released_at ? "released" : "pending",
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    const { data: choices, error: choicesError } = await supabase.rpc("list_churchwork_request_choices");
    return json(200, { ok: true, requests, choices: choicesError ? [] : (choices ?? []) });
  } catch (error) {
    return json(500, { ok: false, code: "pilot-request-list-failed", message: errorMessage(error) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);
    const support = cleanSupport(payload?.support);
    const safeNote = cleanNote(payload?.safeNote);
    const facilityId = typeof payload?.facilityId === "string" ? payload.facilityId : "";
    const partnerId = typeof payload?.partnerId === "string" ? payload.partnerId : "";
    const matches = blockedMatches(safeNote);

    if (!facilityId || !partnerId) {
      return json(400, { ok: false, code: "routing-required", message: "Choose your facility and an available care partner." });
    }

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

    const { supabase, error } = await clientForSession();
    if (error || !supabase) return error;

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return json(401, { ok: false, code: "invalid-session", message: "Your ChurchWork session is no longer valid. Sign in again." });
    }

    const { data, error: insertError } = await supabase
      .from("churchwork_pilot_requests")
      .insert({
        requester_user_id: userData.user.id,
        requester_email: userData.user.email ?? null,
        support_options: support,
        safe_context_note: safeNote,
        status: "facility_review",
        facility_id: facilityId,
        partner_id: partnerId,
        activity_log: [{
          event: "request_submitted",
          at: new Date().toISOString(),
          actor_user_id: userData.user.id
        }]
      })
      .select("id,support_options,safe_context_note,status,facility_approved_at,partner_assigned_at,partner_outcome,requester_update,requester_update_released_at,created_at,updated_at")
      .single();

    if (insertError) {
      return json(503, {
        ok: false,
        code: "pilot-request-save-unavailable",
        message: `Pilot request storage is not available yet: ${insertError.message}`
      });
    }

    const savedRequest = {
      id: data.id,
      support: data.support_options,
      safe_note: data.safe_context_note,
      status: data.status,
      facility_review_status: data.facility_approved_at ? "approved" : "pending",
      partner_assignment_status: data.partner_outcome ? "reported" : data.partner_assigned_at ? "assigned" : "pending",
      requester_update_status: data.requester_update_released_at ? "released" : "pending",
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    return json(201, { ok: true, request: savedRequest, message: "Request saved and sent to facility review." });
  } catch (error) {
    return json(500, { ok: false, code: "pilot-request-save-failed", message: errorMessage(error) });
  }
}
