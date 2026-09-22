import { NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const env = getSupabaseServerEnv();
    const headers: Record<string, string> = {
      apikey: env.anonKey,
      "Cache-Control": "no-cache"
    };

    if (!env.anonKey.startsWith("sb_publishable_")) {
      headers.Authorization = `Bearer ${env.anonKey}`;
    }

    const response = await fetch(`${env.url}/rest/v1/`, {
      method: "GET",
      headers,
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("[churchwork-keepalive] Supabase ping failed", { status: response.status });
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" } }
    );
  } catch (error) {
    console.error("[churchwork-keepalive] Supabase ping unavailable", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
