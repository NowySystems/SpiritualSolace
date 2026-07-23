"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";

type CheckState = "checking" | "pass" | "fail" | "warn";
type Check = { label: string; state: CheckState; detail: string };

const AUTH_CHECK_BUILD = "pilot-auth-check-v1";

function stateLabel(state: CheckState) {
  if (state === "pass") return "PASS";
  if (state === "fail") return "FAIL";
  if (state === "warn") return "WARN";
  return "CHECKING";
}

function rowStateClasses(state: CheckState) {
  if (state === "pass") return "border-emerald-200 bg-emerald-50 text-emerald-950";
  if (state === "fail") return "border-red-200 bg-red-50 text-red-950";
  if (state === "warn") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-slate-200 bg-white text-slate-900";
}

function errorMessage(error: unknown) {
  return error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error";
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "invalid-url";
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
  } finally {
    window.clearTimeout(timer);
  }
}

export default function PilotAuthCheckPage() {
  const [checks, setChecks] = useState<Check[]>([
    { label: "Page loaded", state: "checking", detail: `Running auth checks… build=${AUTH_CHECK_BUILD}` }
  ]);

  useEffect(() => {
    async function runChecks() {
      const next: Check[] = [
        { label: "Build marker", state: "pass", detail: AUTH_CHECK_BUILD },
        { label: "Browser online", state: navigator.onLine ? "pass" : "warn", detail: navigator.onLine ? "navigator.onLine=true" : "navigator.onLine=false" },
        { label: "Current origin", state: "pass", detail: window.location.origin }
      ];

      let url = "";
      let anonKey = "";

      try {
        const env = getSupabaseBrowserEnv();
        url = env.url.replace(/\/$/, "");
        anonKey = env.anonKey;
        next.push({ label: "Supabase env", state: "pass", detail: `urlHost=${safeHost(url)}; anonKeyPresent=${anonKey.length > 20}` });
      } catch (error) {
        next.push({ label: "Supabase env", state: "fail", detail: errorMessage(error) });
        setChecks(next);
        return;
      }

      try {
        const response = await fetchWithTimeout(`${url}/auth/v1/settings`, {
          method: "GET",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`
          }
        });
        next.push({
          label: "Auth settings fetch",
          state: response.ok ? "pass" : "fail",
          detail: `HTTP ${response.status} ${response.statusText}; endpoint=${url}/auth/v1/settings`
        });
      } catch (error) {
        next.push({ label: "Auth settings fetch", state: "fail", detail: errorMessage(error) });
      }

      try {
        const response = await fetchWithTimeout(`${url}/auth/v1/token?grant_type=password`, {
          method: "OPTIONS",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`
          }
        });
        next.push({
          label: "Password auth preflight",
          state: response.ok || response.status === 204 ? "pass" : "warn",
          detail: `HTTP ${response.status} ${response.statusText}; endpoint=${url}/auth/v1/token?grant_type=password`
        });
      } catch (error) {
        next.push({ label: "Password auth preflight", state: "fail", detail: errorMessage(error) });
      }

      try {
        if (!("serviceWorker" in navigator)) {
          next.push({ label: "Service workers", state: "warn", detail: "navigator.serviceWorker unavailable." });
        } else {
          const registrations = await navigator.serviceWorker.getRegistrations();
          next.push({ label: "Service workers", state: "pass", detail: `${registrations.length} registration(s): ${registrations.map((registration) => registration.scope).join(", ") || "none"}` });
        }
      } catch (error) {
        next.push({ label: "Service workers", state: "warn", detail: errorMessage(error) });
      }

      setChecks(next);
    }

    void runChecks();
  }, []);

  return (
    <main className="min-h-screen bg-[#020719] px-5 py-12 text-white">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">ChurchWork Pilot Auth Diagnostics</p>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Supabase connection check</h1>
        <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-emerald-200">Build marker: {AUTH_CHECK_BUILD}</p>
        <p className="mt-6 text-lg font-semibold leading-8 text-white/80">
          This checks whether this exact browser can reach the live Supabase auth endpoints used by /pilot sign-in.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a href="/pilot" className="rounded-3xl bg-emerald-300 px-6 py-5 text-center text-lg font-black text-slate-950">Back to pilot sign-in</a>
          <button type="button" onClick={() => window.location.reload()} className="rounded-3xl bg-white px-6 py-5 text-lg font-black text-slate-950">Refresh check</button>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-3xl gap-5">
        {checks.map((check) => (
          <article key={`${check.label}-${check.detail}`} className={`rounded-[1.75rem] border p-6 shadow-lg ${rowStateClasses(check.state)}`}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-black">{check.label}</h2>
              <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-black text-slate-900">{stateLabel(check.state)}</span>
            </div>
            <p className="mt-4 break-words text-lg font-bold leading-8">{check.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
