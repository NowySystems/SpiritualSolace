import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

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

    const { data, error } = await supabase.rpc("list_churchwork_pilot_organizations");
    if (error) {
      return json(403, { ok: false, message: "Pilot Admin access is required to view organizations." });
    }

    return json(200, { ok: true, organizations: Array.isArray(data) ? data : [] });
  } catch {
    return json(503, { ok: false, message: "ChurchWork organizations are temporarily unavailable." });
  }
}
