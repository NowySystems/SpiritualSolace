import { NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const env = getSupabaseServerEnv();
    const headers: Record<string, string> = {
      apikey: env.anonKey,
      Authorization: `Bearer ${env.anonKey}`,
      "Cache-Control": "no-cache"
    };

    const authResponse = await fetch(`${env.url}/auth/v1/settings`, {
      method: "GET",
      headers,
      cache: "no-store"
    });

    if (!authResponse.ok) {
      console.error("[churchwork-keepalive] Supabase auth health failed", {
        status: authResponse.status
      });
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    const response = await fetch(`${env.url}/rest/v1/rpc/churchwork_keepalive`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: "{}",
      cache: "no-store"
    });

    if (!response.ok) {
      const upstreamBody = await response.text().catch(() => "");
      console.error("[churchwork-keepalive] Supabase heartbeat failed", {
        status: response.status,
        detail: upstreamBody.slice(0, 240)
      });
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
