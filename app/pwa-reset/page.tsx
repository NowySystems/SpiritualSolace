"use client";

import { useEffect, useState } from "react";

const RESET_BUILD = "pwa-reset-uploaded-exact-v1";

export default function PwaResetPage() {
  const [status, setStatus] = useState("Preparing hard reset…");
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function resetPwaState() {
      const steps: string[] = [];

      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
          steps.push(`Unregistered ${registrations.length} service worker(s).`);
        } else {
          steps.push("Service workers are not available in this browser context.");
        }
      } catch (error) {
        steps.push(`Service-worker reset failed: ${error instanceof Error ? error.message : "unknown error"}`);
      }

      try {
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
          steps.push(`Deleted ${keys.length} browser cache bucket(s).`);
        } else {
          steps.push("Cache API is not available in this browser context.");
        }
      } catch (error) {
        steps.push(`Cache reset failed: ${error instanceof Error ? error.message : "unknown error"}`);
      }

      try {
        for (const storage of [window.localStorage, window.sessionStorage]) {
          const keysToRemove: string[] = [];
          for (let index = 0; index < storage.length; index += 1) {
            const key = storage.key(index);
            if (key && key.toLowerCase().includes("churchwork")) keysToRemove.push(key);
          }
          keysToRemove.forEach((key) => storage.removeItem(key));
        }
        steps.push("Cleared ChurchWork local browser flags.");
      } catch (error) {
        steps.push(`Storage reset skipped: ${error instanceof Error ? error.message : "unknown error"}`);
      }

      setStatus(steps.join("\n"));
      setDone(true);
    }

    void resetPwaState();
  }, []);

  function continueToCheck() {
    window.location.href = `/pwa-check?fresh=${Date.now()}`;
  }

  function continueToHome() {
    window.location.href = `/?fresh=${Date.now()}`;
  }

  return (
    <main className="min-h-screen bg-[#020719] px-5 py-12 text-white">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">ChurchWork PWA Reset</p>
        <h1 className="mt-6 text-4xl font-black tracking-tight">Reset phone install state</h1>
        <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-emerald-200">
          Build marker: {RESET_BUILD}
        </p>
        <p className="mt-6 whitespace-pre-wrap text-lg font-bold leading-8 text-white/80">{status}</p>
        <div className="mt-8 grid gap-4">
          <button
            type="button"
            onClick={continueToCheck}
            disabled={!done}
            className="rounded-3xl bg-emerald-300 px-6 py-5 text-lg font-black text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-800"
          >
            Continue to fresh PWA check
          </button>
          <button
            type="button"
            onClick={continueToHome}
            disabled={!done}
            className="rounded-3xl bg-white px-6 py-5 text-lg font-black text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-800"
          >
            Continue to ChurchWork home
          </button>
        </div>
      </section>
    </main>
  );
}
