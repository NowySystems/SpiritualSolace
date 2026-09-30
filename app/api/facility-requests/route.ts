import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

const fields = "id,requester_email,support_options,safe_context_note,status,facility_approved_at,partner_assigned_at,partner_outcome,requester_update,created_at,updated_at";

function sessionToken(request: NextRequest) {
  if (request.cookies.get("churchwork_role")?.value !== "facility") return "";
  return request.cookies.get("churchwork_role_session")?.value ?? "";
}

function headers(anonKey: string, token: string) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

async function hasFacilityMembership(env: ReturnType<typeof getSupabaseServerEnv>, token: string) {
  const response = await fetch(`${env.url}/rest/v1/role_memberships?select=id&role=in.(facility_admin,facility_staff)&status=eq.active&limit=1`, {
    headers: headers(env.anonKey, token), cache: "no-store"
  });
  if (!response.ok) return false;
  const body = await response.json().catch(() => []);
  return Array.isArray(body) && body.length > 0;
}

export async function GET(request: NextRequest) {
  const token = sessionToken(request);
  if (!token) return NextResponse.json({ message: "Facility sign-in required." }, { status: 401 });

  const env = getSupabaseServerEnv();
  if (!(await hasFacilityMembership(env, token))) return NextResponse.json({ message: "Create your facility workspace to continue.", code: "onboarding-required" }, { status: 403 });
  const response = await fetch(
    `${env.url}/rest/v1/churchwork_pilot_requests?select=${encodeURIComponent(fields)}&order=created_at.desc`,
    { headers: headers(env.anonKey, token), cache: "no-store" }
  );
  const body = await response.json().catch(() => null);
  return NextResponse.json(body, { status: response.status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  const token = sessionToken(request);
  if (!token) return NextResponse.json({ message: "Facility sign-in required." }, { status: 401 });

  const payload = await request.json().catch(() => ({})) as { requestId?: string; action?: string };
  if (!payload.requestId || !["approve", "release_update"].includes(payload.action ?? "")) {
    return NextResponse.json({ message: "Invalid facility action." }, { status: 400 });
  }

  const env = getSupabaseServerEnv();
  if (!(await hasFacilityMembership(env, token))) return NextResponse.json({ message: "Approved facility access required." }, { status: 403 });
  const response = await fetch(`${env.url}/rest/v1/rpc/facility_advance_churchwork_pilot_request`, {
    method: "POST",
    headers: headers(env.anonKey, token),
    body: JSON.stringify({ p_request_id: payload.requestId, p_action: payload.action }),
    cache: "no-store"
  });
  const body = await response.json().catch(() => null);
  return NextResponse.json(body, { status: response.status, headers: { "Cache-Control": "private, no-store" } });
}


export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
  response.cookies.set("churchwork_role_session", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set("churchwork_role", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
