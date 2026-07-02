"use client";

import type { ReactNode } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type PilotAuthGateProps = {
  children: (session: Session) => ReactNode;
};

type AuthMode = "sign-in" | "sign-up" | "forgot-password";

export function PilotAuthGate({ children }: PilotAuthGateProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [status, setStatus] = useState("Checking session...");
  const [isBusy, setIsBusy] = useState(false);

  const isPasswordMode = mode !== "forgot-password";

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setStatus(data.session ? "Signed in." : "Sign in or create an approved pilot account.");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? "Signed in." : "Sign in or create an approved pilot account.");
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);

    if (mode === "forgot-password") {
      setStatus("Sending password reset email...");
      const redirectTo = `${window.location.origin}/pilot/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (error) {
        setStatus(error.message);
        setIsBusy(false);
        return;
      }

      setStatus("Check your email for the password reset link.");
      setIsBusy(false);
      return;
    }

    setStatus(mode === "sign-in" ? "Signing in..." : "Creating account...");

    const action = mode === "sign-in" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { data, error } = await action.bind(supabase.auth)({ email, password });

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      return;
    }

    if (data.session) {
      setSession(data.session);
      setStatus("Signed in.");
    } else {
      setStatus("Check your email to confirm the account before signing in.");
    }

    setIsBusy(false);
  }

  async function handleSignOut() {
    setIsBusy(true);
    await supabase.auth.signOut();
    setSession(null);
    setStatus("Signed out.");
    setIsBusy(false);
  }

  function submitLabel() {
    if (isBusy) return "Working...";
    if (mode === "forgot-password") return "Send password reset link";
    return mode === "sign-in" ? "Sign in" : "Create pilot account";
  }

  if (session) {
    return (
      <div className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
        <header className="border-b border-[#d8d0c0] bg-white/85 px-6 py-4 shadow-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">ChurchWork Pilot</p>
              <h1 className="font-serif text-3xl font-semibold tracking-[-0.03em]">Pilot access</h1>
            </div>
            <div className="flex flex-col gap-2 text-sm md:items-end">
              <p className="font-semibold text-[#4d5d55]">{session.user.email}</p>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isBusy}
                className="rounded-lg border border-[#d8d0c0] bg-white px-4 py-2 text-sm font-bold text-[#173b2d] hover:bg-[#f0f5e8] disabled:opacity-60"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        {children(session)}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ea] px-6 py-12 text-[#102b3a]">
      <section className="w-full max-w-xl rounded-[2rem] border border-[#d8d0c0] bg-white p-8 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">ChurchWork Pilot</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em]">
          {mode === "forgot-password" ? "Reset password" : "Pilot sign in"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#4d5d55]">
          {mode === "forgot-password"
            ? "Enter the email for your pilot account. ChurchWork will send a secure password reset link."
            : "Use a named pilot account. Do not share logins. ChurchWork pilot access is for approved spiritual-care coordination only."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-[#173b2d]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
            />
          </label>

          {isPasswordMode ? (
            <label className="block text-sm font-bold text-[#173b2d]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
              />
              {mode === "sign-up" ? (
                <span className="mt-2 block text-xs leading-5 text-[#4d5d55]">
                  Use at least 8 characters. A longer passphrase with a mix of letters, numbers, and symbols is better.
                </span>
              ) : null}
            </label>
          ) : null}

          <div className="rounded-xl border border-[#ddb66c]/45 bg-[#fff8e7] p-4 text-sm leading-6 text-[#5f4b1f]">
            This pilot is not for emergencies, medical records, diagnosis, symptoms, medication, treatment details, chart notes, clinical instructions, or insurance information.
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full rounded-xl bg-[#173b2d] px-5 py-3 text-base font-bold text-white shadow-lg hover:bg-[#102b3a] disabled:opacity-60"
          >
            {submitLabel()}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setMode(mode === "sign-up" ? "sign-in" : "sign-up")}
              className="text-left font-bold text-[#173b2d] underline-offset-4 hover:underline"
            >
              {mode === "sign-up" ? "Already have an account? Sign in" : "Need an account? Create one"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "forgot-password" ? "sign-in" : "forgot-password")}
              className="text-left font-bold text-[#173b2d] underline-offset-4 hover:underline"
            >
              {mode === "forgot-password" ? "Back to sign in" : "Forgot password?"}
            </button>
          </div>
          <p className="font-semibold text-[#4d5d55]">{status}</p>
        </div>
      </section>
    </main>
  );
}
