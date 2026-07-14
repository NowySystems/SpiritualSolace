"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const ACCESS_SESSION_KEY = "churchwork:pilot-access";

type ChurchWorkAccessGateProps = {
  children: ReactNode;
};

export function ChurchWorkAccessGate({ children }: ChurchWorkAccessGateProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      const hasLegacyAccessCode = sessionStorage.getItem(ACCESS_SESSION_KEY) === "granted";
      const { data } = await supabase.auth.getSession();
      const hasPilotSession = Boolean(data.session);

      if (!isMounted) return;
      setAccessGranted(hasLegacyAccessCode || hasPilotSession);
      setAccessChecked(true);
    }

    void checkAccess();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setAccessGranted(sessionStorage.getItem(ACCESS_SESSION_KEY) === "granted" || Boolean(nextSession));
      setAccessChecked(true);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/churchwork-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ accessCode })
      });

      if (!response.ok) {
        setErrorMessage("That access code did not work. Please try again.");
        return;
      }

      sessionStorage.setItem(ACCESS_SESSION_KEY, "granted");
      setAccessGranted(true);
      setAccessCode("");
    } catch {
      setErrorMessage("Access check is temporarily unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!accessChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f3ea] px-6 text-[#102b3a]">
        <p className="text-sm font-semibold text-[#4d5d55]">Preparing ChurchWork…</p>
      </div>
    );
  }

  if (accessGranted) {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ea] px-6 py-12 text-[#102b3a]">
      <section className="w-full max-w-md rounded-[2rem] border border-[#d8d0c0] bg-white/90 p-8 shadow-2xl shadow-[#0d2b3b]/10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d2b3b] text-3xl text-white">🕊</div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#789052]">ChurchWork</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">Private pilot access</h1>
          <p className="mt-4 text-sm leading-6 text-[#4d5d55]">
            Sign in through the pilot workspace or enter the access code to continue into the ChurchWork portal experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-bold text-[#173b2d]" htmlFor="churchwork-access-code">
            Access code
          </label>
          <input
            id="churchwork-access-code"
            type="password"
            autoComplete="current-password"
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            className="w-full rounded-xl border border-[#cfc5b2] bg-white px-4 py-3 text-base text-[#102b3a] outline-none ring-[#86a45f]/25 transition focus:border-[#86a45f] focus:ring-4"
            placeholder="Enter code"
            required
          />
          {errorMessage ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#0d2b3b] px-5 py-3 text-base font-bold text-white shadow-lg transition hover:bg-[#173b2d] disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? "Checking…" : "Continue"}
          </button>
        </form>
      </section>
    </main>
  );
}
