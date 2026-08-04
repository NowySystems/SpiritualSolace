"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_FROM = "/admin";

function cleanReturnPath(value: string | null) {
  if (!value || !value.startsWith("/")) return DEFAULT_FROM;
  if (value.startsWith("//")) return DEFAULT_FROM;
  return value;
}

export default function InternalAccessPage() {
  const searchParams = useSearchParams();
  const [accessKey, setAccessKey] = useState("");
  const returnPath = useMemo(() => cleanReturnPath(searchParams.get("from")), [searchParams]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextUrl = new URL(returnPath, window.location.origin);
    nextUrl.searchParams.set("access", accessKey.trim());
    window.location.href = nextUrl.toString();
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-12 text-[#0d2b3b]">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-[#d8d0c0] bg-white p-7 shadow-2xl shadow-[#0d2b3b]/10 md:p-10">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#d8d0c0]">
            <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">Private workspace</p>
            <h1 className="font-serif text-3xl font-semibold tracking-[-0.04em] md:text-4xl">ChurchWork internal access</h1>
          </div>
        </div>

        <p className="mt-6 text-base font-semibold leading-8 text-[#4d5d55]">
          Admin, MVP sandbox, previews, diagnostics, and pilot tools are internal-only. Use the internal access key to continue.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="block">
            <span className="text-sm font-black text-[#0d2b3b]">Access key</span>
            <input
              type="password"
              value={accessKey}
              onChange={(event) => setAccessKey(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-[#f8fbf8] px-4 py-4 text-base font-bold outline-[#0f6b54]"
              autoComplete="current-password"
              autoFocus
            />
          </label>

          <button type="submit" className="w-full rounded-2xl bg-[#173b2d] px-5 py-4 text-base font-black text-white shadow-lg hover:bg-[#102b3a]">
            Continue to private workspace
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-[#eed9a8] bg-[#fff8e7] p-4 text-sm font-semibold leading-6 text-[#5f4b1f]">
          Public visitors should only see the ChurchWork public landing page. This page does not unlock production data, auth, or Supabase writes.
        </div>

        <a href="/" className="mt-6 inline-flex text-sm font-black text-[#173b2d] underline-offset-4 hover:underline">
          Return to public ChurchWork page
        </a>
      </section>
    </main>
  );
}
