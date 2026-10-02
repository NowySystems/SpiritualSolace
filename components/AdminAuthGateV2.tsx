"use client";

import type { ReactNode } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { TurnstileChallenge } from "@/components/TurnstileChallenge";

type Props = { children: (session: Session | null) => ReactNode };

export function AdminAuthGateV2({ children }: Props) {
  const synthetic = process.env.NEXT_PUBLIC_CHURCHWORK_SYNTH_ADMIN === "true";
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [authorized, setAuthorized] = useState(synthetic);
  const [checked, setChecked] = useState(synthetic);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);

  async function verify(next: Session) {
    await supabase.rpc("sync_current_pilot_profile");
    await supabase.rpc("claim_churchwork_bootstrap_admin");

    const { error } = await supabase.rpc("get_churchwork_network_snapshot");
    if (error) {
      setAuthorized(false);
      const lower = error.message.toLowerCase();
      setStatus(lower.includes("not authorized") || lower.includes("permission")
        ? "This account is not authorized for ChurchWork Admin."
        : error.message);
      return false;
    }

    setAuthorized(true);
    setStatus("Admin access verified.");
    return true;
  }

  useEffect(() => {
    if (synthetic) return;
    let mounted = true;
    const fallback = window.setTimeout(() => {
      if (!mounted) return;
      setChecked(true);
      setStatus("Sign in with your ChurchWork admin account.");
    }, 2500);

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      window.clearTimeout(fallback);
      const current = data.session ?? null;
      setSession(current);
      setChecked(true);
      if (!current) {
        setAuthorized(false);
        setStatus("Sign in with your ChurchWork admin account.");
        return;
      }
      await verify(current);
    }).catch(() => {
      if (!mounted) return;
      window.clearTimeout(fallback);
      setChecked(true);
      setStatus("Sign in with your ChurchWork admin account.");
    });

    return () => {
      mounted = false;
      window.clearTimeout(fallback);
    };
  }, [supabase, synthetic]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captchaToken) {
      setStatus("Complete the security check.");
      return;
    }

    setBusy(true);
    setStatus("Signing in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken }
    });

    if (error || !data.session) {
      setStatus(error?.message ?? "Sign in did not complete.");
      setCaptchaToken(null);
      setCaptchaResetKey((value) => value + 1);
      setBusy(false);
      return;
    }

    setSession(data.session);
    const ok = await verify(data.session);
    if (!ok) await supabase.auth.signOut();
    setBusy(false);
  }

  async function signOut() {
    setBusy(true);
    await supabase.auth.signOut();
    setSession(null);
    setAuthorized(false);
    setPassword("");
    setStatus("Signed out.");
    setBusy(false);
  }

  if (synthetic) return <>{children(null)}</>;

  if (!checked) {
    return <main className="flex min-h-screen items-center justify-center bg-[#edf4f0] text-[#0d2b3b]">
      <p className="font-bold">Checking ChurchWork Admin…</p>
    </main>;
  }

  if (session && authorized) {
    return <div>
      <div className="border-b border-[#d9dfd7] bg-[#082838] px-5 py-3 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm">
          <span className="font-bold">{session.user.email}</span>
          <button type="button" onClick={signOut} disabled={busy} className="rounded-lg border border-white/25 px-3 py-2 font-black disabled:opacity-60">Sign out</button>
        </div>
      </div>
      {children(session)}
    </div>;
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#edf4f0] px-5 py-10 text-[#0d2b3b]">
    <section className="w-full max-w-md rounded-[2rem] border border-[#d9dfd7] bg-white p-7 shadow-xl">
      <div className="flex items-center gap-3">
        <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-12 w-16 object-contain" />
        <div>
          <p className="font-serif text-2xl font-semibold">Church<span className="text-[#6e9a7c]">Work</span></p>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Admin</p>
        </div>
      </div>
      <h1 className="mt-7 font-serif text-4xl font-semibold tracking-[-0.04em]">Admin sign in</h1>
      <p className="mt-3 text-sm leading-6 text-[#4f6259]">Use your ChurchWork owner/admin email and password.</p>
      <form onSubmit={signIn} className="mt-6 space-y-4">
        <label className="block text-sm font-black">Email
          <input type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d9dfd7] px-4 py-3 text-base" />
        </label>
        <label className="block text-sm font-black">Password
          <input type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d9dfd7] px-4 py-3 text-base" />
        </label>
        <TurnstileChallenge onToken={setCaptchaToken} resetKey={captchaResetKey} />
        <button type="submit" disabled={busy || !captchaToken} className="w-full rounded-xl bg-[#082838] px-5 py-3 font-black text-white disabled:opacity-50">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 rounded-xl bg-[#f8fbf8] p-4 text-sm font-bold text-[#4f6259]">{status}</p>
      <a href="/" className="mt-5 inline-flex text-sm font-black underline-offset-4 hover:underline">Back to public site</a>
    </section>
  </main>;
}
