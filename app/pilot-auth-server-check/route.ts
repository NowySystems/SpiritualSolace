import { NextResponse } from "next/server";
import { getSupabaseEnvReport, getSupabaseServerEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BUILD = "pilot-auth-server-check-v2";

type CheckState = "pass" | "fail" | "warn";
type Check = { label: string; state: CheckState; detail: string };

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "invalid-url";
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error";
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const checks: Check[] = [
    { label: "Build marker", state: "pass", detail: BUILD },
    { label: "Runtime", state: "pass", detail: "Vercel/Next.js server route" }
  ];

  const envReport = getSupabaseEnvReport();
  let env: ReturnType<typeof getSupabaseServerEnv>;

  try {
    env = getSupabaseServerEnv();
    checks.push({
      label: "Supabase env",
      state: "pass",
      detail: `source=${env.source}; urlHost=${safeHost(env.url)}; envReport=${JSON.stringify(envReport)}`
    });
  } catch (error) {
    checks.push({
      label: "Supabase env",
      state: "fail",
      detail: `${errorMessage(error)}; envReport=${JSON.stringify(envReport)}`
    });

    return NextResponse.json({
      schema: "churchwork.pilot-auth-server-check.v2",
      status: "fail",
      build: BUILD,
      checks,
      envReport,
      note: "This route does not expose the anon key. It only reports presence, safe shape checks, and endpoint reachability."
    }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const response = await fetchWithTimeout(`${env.url}/auth/v1/settings`, {
      method: "GET",
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`
      }
    });

    checks.push({
      label: "Auth settings fetch",
      state: response.ok ? "pass" : "fail",
      detail: `HTTP ${response.status} ${response.statusText}; host=${safeHost(env.url)}`
    });
  } catch (error) {
    checks.push({ label: "Auth settings fetch", state: "fail", detail: errorMessage(error) });
  }

  try {
    const response = await fetchWithTimeout(`${env.url}/auth/v1/token?grant_type=password`, {
      method: "OPTIONS",
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`
      }
    });

    checks.push({
      label: "Password auth preflight",
      state: response.ok || response.status === 204 ? "pass" : "warn",
      detail: `HTTP ${response.status} ${response.statusText}; host=${safeHost(env.url)}`
    });
  } catch (error) {
    checks.push({ label: "Password auth preflight", state: "fail", detail: errorMessage(error) });
  }

  const hasFailure = checks.some((check) => check.state === "fail");
  const hasWarning = checks.some((check) => check.state === "warn");

  return NextResponse.json({
    schema: "churchwork.pilot-auth-server-check.v2",
    status: hasFailure ? "fail" : hasWarning ? "warn" : "pass",
    build: BUILD,
    checks,
    envReport,
    compareWith: "/pilot-auth-check",
    interpretation: {
      serverPassBrowserFail: "Supabase is reachable from Vercel, but the user browser/device/network is blocking or failing the auth request.",
      serverFailBrowserFail: "Supabase env, project, endpoint, or upstream access is likely the problem.",
      serverPassBrowserPassPilotFail: "Auth endpoint is reachable; credentials, confirmation, policy gate, or app logic is the next suspect."
    },
    note: "This route does not expose the anon key. It only reports presence, safe shape checks, and endpoint reachability."
  }, { headers: { "Cache-Control": "no-store" } });
}
