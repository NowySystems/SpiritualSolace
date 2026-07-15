"use client";

import { useEffect, useState } from "react";

type CheckState = "checking" | "pass" | "fail" | "warn";

type Check = {
  label: string;
  state: CheckState;
  detail: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type ManifestIcon = {
  src?: string;
  sizes?: string;
  type?: string;
  purpose?: string;
};

type ManifestShape = {
  id?: string;
  name?: string;
  short_name?: string;
  start_url?: string;
  scope?: string;
  display?: string;
  icons?: ManifestIcon[];
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function absoluteUrl(path: string, base = window.location.origin) {
  return new URL(path, base).toString();
}

function manifestHref() {
  const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  return link?.href ?? absoluteUrl("/manifest-v2.webmanifest");
}

async function fetchJson<T>(url: string) {
  const busted = `${url}${url.includes("?") ? "&" : "?"}pwaCheck=${Date.now()}`;
  const response = await fetch(busted, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return (await response.json()) as T;
}

async function fetchOk(url: string) {
  const busted = `${url}${url.includes("?") ? "&" : "?"}pwaCheck=${Date.now()}`;
  const response = await fetch(busted, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response;
}

async function imageDimensions(path: string, base: string) {
  const absolute = absoluteUrl(path, base);
  const response = await fetchOk(absolute);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const dimensions = { width: bitmap.width, height: bitmap.height, type: response.headers.get("content-type") ?? "unknown", absolute };
  bitmap.close();
  return dimensions;
}

function rowStateClasses(state: CheckState) {
  if (state === "pass") return "border-emerald-200 bg-emerald-50 text-emerald-950";
  if (state === "fail") return "border-red-200 bg-red-50 text-red-950";
  if (state === "warn") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-slate-200 bg-white text-slate-900";
}

function stateLabel(state: CheckState) {
  if (state === "pass") return "PASS";
  if (state === "fail") return "FAIL";
  if (state === "warn") return "WARN";
  return "CHECKING";
}

export default function PwaCheckPage() {
  const [checks, setChecks] = useState<Check[]>([
    { label: "Page loaded", state: "checking", detail: "Running browser-side PWA checks…" }
  ]);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installResult, setInstallResult] = useState<string>("");

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setChecks((current) => {
        const withoutNative = current.filter((check) => check.label !== "Native install event");
        return [
          ...withoutNative,
          { label: "Native install event", state: "pass", detail: "Chrome fired beforeinstallprompt. Native install button can work." }
        ];
      });
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    async function runChecks() {
      const next: Check[] = [];

      next.push({
        label: "Secure context",
        state: window.isSecureContext ? "pass" : "fail",
        detail: window.isSecureContext ? `Secure origin: ${window.location.origin}` : "Chrome requires HTTPS or localhost for PWA install."
      });

      next.push({
        label: "Standalone mode",
        state: isStandaloneMode() ? "pass" : "warn",
        detail: isStandaloneMode() ? "Already running as an installed app." : "Running in browser tab, so install prompt may appear if eligible."
      });

      const linkedManifest = manifestHref();
      next.push({
        label: "Linked manifest",
        state: linkedManifest.includes("manifest-v2.webmanifest") ? "pass" : "warn",
        detail: linkedManifest
      });

      let manifest: ManifestShape | null = null;
      try {
        manifest = await fetchJson<ManifestShape>(linkedManifest);
        next.push({
          label: "Manifest fetch",
          state: manifest.id === "/churchwork-app-v2" ? "pass" : "warn",
          detail: `Loaded manifest. id=${manifest.id ?? "missing"}, start_url=${manifest.start_url ?? "missing"}, display=${manifest.display ?? "missing"}`
        });
      } catch (error) {
        next.push({ label: "Manifest fetch", state: "fail", detail: error instanceof Error ? error.message : "Manifest failed to load." });
      }

      if (manifest) {
        next.push({
          label: "Manifest required fields",
          state: manifest.name && manifest.start_url && manifest.scope && manifest.display === "standalone" ? "pass" : "fail",
          detail: `name=${manifest.name ?? "missing"}, start_url=${manifest.start_url ?? "missing"}, scope=${manifest.scope ?? "missing"}, display=${manifest.display ?? "missing"}`
        });

        try {
          const startUrl = absoluteUrl(manifest.start_url ?? "/admin?source=pwa-v2", linkedManifest);
          await fetchOk(startUrl);
          next.push({ label: "Manifest start_url", state: "pass", detail: `${manifest.start_url ?? "/admin?source=pwa-v2"} is reachable.` });
        } catch (error) {
          next.push({ label: "Manifest start_url", state: "fail", detail: error instanceof Error ? error.message : "start_url failed to load." });
        }

        const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
        const icon192 = icons.find((icon) => icon.sizes === "192x192" && icon.src);
        const icon512 = icons.find((icon) => icon.sizes === "512x512" && icon.src && (icon.purpose ?? "any").includes("any"));
        const maskable512 = icons.find((icon) => icon.sizes === "512x512" && icon.src && (icon.purpose ?? "").includes("maskable"));

        next.push({
          label: "Manifest icons declared",
          state: icon192 && icon512 && maskable512 ? "pass" : "fail",
          detail: `192=${icon192?.src ?? "missing"}, 512=${icon512?.src ?? "missing"}, maskable=${maskable512?.src ?? "missing"}`
        });

        for (const icon of [icon192, icon512, maskable512].filter(Boolean) as ManifestIcon[]) {
          const src = icon.src ?? "";
          try {
            const dimensions = await imageDimensions(src, linkedManifest);
            next.push({
              label: `Icon ${icon.sizes ?? src}`,
              state: `${dimensions.width}x${dimensions.height}` === icon.sizes ? "pass" : "fail",
              detail: `${src} decoded as ${dimensions.width}x${dimensions.height}; content-type=${dimensions.type}; absolute=${dimensions.absolute}`
            });
          } catch (error) {
            next.push({ label: `Icon ${icon.sizes ?? src}`, state: "fail", detail: error instanceof Error ? error.message : `${src} failed to decode.` });
          }
        }
      }

      if (!("serviceWorker" in navigator)) {
        next.push({ label: "Service worker support", state: "fail", detail: "navigator.serviceWorker is not available in this browser context." });
      } else {
        next.push({ label: "Service worker support", state: "pass", detail: "navigator.serviceWorker is available." });

        try {
          const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
          await registration.update().catch(() => undefined);
          next.push({
            label: "Service worker registration",
            state: registration.active || registration.installing || registration.waiting ? "pass" : "warn",
            detail: `scope=${registration.scope}; active=${registration.active?.state ?? "none"}; installing=${registration.installing?.state ?? "none"}; waiting=${registration.waiting?.state ?? "none"}`
          });
        } catch (error) {
          next.push({ label: "Service worker registration", state: "fail", detail: error instanceof Error ? error.message : "Service worker registration failed." });
        }

        next.push({
          label: "Page controlled by service worker",
          state: navigator.serviceWorker.controller ? "pass" : "warn",
          detail: navigator.serviceWorker.controller
            ? `Controlled by ${navigator.serviceWorker.controller.scriptURL}`
            : "Not controlled yet. Refresh this page once after service worker registration completes."
        });
      }

      setChecks(next);

      window.setTimeout(() => {
        setChecks((current) => {
          if (current.some((check) => check.label === "Native install event")) return current;
          return [
            ...current,
            {
              label: "Native install event",
              state: "fail",
              detail: "Chrome has not fired beforeinstallprompt on this page. If all other checks pass, Chrome is suppressing installability for this session/device or the live app shell still differs from expectations."
            }
          ];
        });
      }, 5000);
    }

    void runChecks();

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice.catch(() => null);
    setInstallResult(choice ? `Chrome install result: ${choice.outcome}` : "Chrome install dialog closed.");
    setInstallEvent(null);
  }

  return (
    <main className="min-h-screen bg-[#020719] px-5 py-12 text-white">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">ChurchWork PWA Diagnostics</p>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Live installability check</h1>
        <p className="mt-6 text-lg font-semibold leading-8 text-white/80">
          This page checks the actual browser session on this phone. Green checks mean the live site is meeting that install gate. The native Install button only appears after Chrome fires <code>beforeinstallprompt</code>.
        </p>
        <button
          type="button"
          onClick={handleInstall}
          disabled={!installEvent}
          className="mt-8 w-full rounded-3xl bg-emerald-300 px-6 py-5 text-lg font-black text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-700"
        >
          {installEvent ? "Install ChurchWork" : "Install not available yet"}
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 w-full rounded-3xl bg-white px-6 py-5 text-lg font-black text-slate-950"
        >
          Refresh check
        </button>
        {installResult ? <p className="mt-4 text-sm font-bold text-white/75">{installResult}</p> : null}
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
