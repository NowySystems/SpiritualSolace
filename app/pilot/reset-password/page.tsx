"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function PilotResetPasswordPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("Enter a new password for your ChurchWork pilot account.");
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    setIsBusy(true);
    setStatus("Updating password...");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setStatus("Password updated. You can return to pilot sign in.");
    setIsBusy(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ea] px-6 py-12 text-[#102b3a]">
      <section className="w-full max-w-xl rounded-[2rem] border border-[#d8d0c0] bg-white p-8 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">ChurchWork Pilot</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em]">Create a new password</h1>
        <p className="mt-4 text-sm leading-7 text-[#4d5d55]">
          Use the password reset link from your email, then choose a new password for your pilot account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-[#173b2d]">
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
            />
            <span className="mt-2 block text-xs leading-5 text-[#4d5d55]">
              Use at least 8 characters. A longer passphrase with a mix of letters, numbers, and symbols is better.
            </span>
          </label>

          <label className="block text-sm font-bold text-[#173b2d]">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
            />
          </label>

          <div className="rounded-xl border border-[#ddb66c]/45 bg-[#fff8e7] p-4 text-sm leading-6 text-[#5f4b1f]">
            ChurchWork never asks for your password by phone, text, or email. Use this page only after opening the secure reset link.
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full rounded-xl bg-[#173b2d] px-5 py-3 text-base font-bold text-white shadow-lg hover:bg-[#102b3a] disabled:opacity-60"
          >
            {isBusy ? "Updating..." : "Update password"}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Link href="/requester-login" className="font-bold text-[#173b2d] underline-offset-4 hover:underline">
            Return to requester sign in
          </Link>
          <p className="font-semibold text-[#4d5d55]">{status}</p>
        </div>
      </section>
    </main>
  );
}
