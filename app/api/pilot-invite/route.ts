import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
  if (token.length < 32) return json(400, { ok: false, valid: false });

  let env: ReturnType<typeof getSupabaseServerEnv>;
  try {
    env = getSupabaseServerEnv();
  } catch {
    return json(503, { ok: false, valid: false, message: "ChurchWork invite validation is unavailable." });
  }

  const supabase = createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  const { data, error } = await supabase.rpc("validate_churchwork_portal_invite", { p_token: token });
  if (error) return json(503, { ok: false, valid: false, message: "ChurchWork invite validation is unavailable." });

  const invite = data && typeof data === "object" ? data as Record<string, unknown> : {};
  return json(200, { ok: true, ...invite });
}
