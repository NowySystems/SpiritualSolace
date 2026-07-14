"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type CheckStatus = "checking" | "pass" | "fail";

type InstallCheck = {
  label: string;
  status: CheckStatus;
  detail: string;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function statusLabel(status: CheckStatus) {
  if (status === "pass") return "Ready";
  if (status === "fail") return "Needs attention";
  return "Checking";
}

function statusStyle(status: CheckStatus) {
  if (status === "pass") return { background: "#e5f4ed", color: "#11613c", borderColor: "#b7dfca" };
  if (status === "fail") return { background: "#fff4e5", color: "#8a4b08", borderColor: "#f0c98c" };
  return { background: "#eef3f8", color: "#38556a", borderColor: "#c9d8e4" };
}

export default function ChurchWorkInstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installOutcome, setInstallOutcome] = useState<string | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [checks, setChecks] = useState<InstallCheck[]>([
    { label: "Secure page", status: "checking", detail: "Checking HTTPS." },
    { label: "Manifest", status: "checking", detail: "Checking manifest.webmanifest." },
    { label: "App icon", status: "checking", detail: "Checking the phone icon asset." },
    { label: "Service worker", status: "checking", detail: "Checking app shell control." },
    { label: "Native install prompt", status: "checking", detail: "Waiting for Chrome to allow install." }
  ]);

  const nativeInstallReady = Boolean(deferredPrompt);

  const summary = useMemo(() => {
    if (standalone) return "ChurchWork is already running as an installed app on this device.";
    if (nativeInstallReady) return "Chrome says ChurchWork is installable on this device.";
    return "Keep this page open for a few seconds. If Chrome approves the app, the install button will appear here.";
  }, [nativeInstallReady, standalone]);

  useEffect(() => {
    let isMounted = true;

    function updateCheck(label: string, status: CheckStatus, detail: string) {
      if (!isMounted) return;
      setChecks((current) => current.map((check) => (check.label === label ? { ...check, status, detail } : check)));
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      updateCheck("Native install prompt", "pass", "Chrome has made the real install button available.");
    }

    setStandalone(isStandaloneMode());
    updateCheck("Secure page", window.location.protocol === "https:" ? "pass" : "fail", window.location.protocol === "https:" ? "Running on HTTPS." : "Chrome requires HTTPS for install.");

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    fetch("/manifest.webmanifest", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest returned ${response.status}`);
        return response.json();
      })
      .then((manifest) => {
        updateCheck("Manifest", "pass", `Manifest loaded. Start URL: ${manifest.start_url || "not set"}.`);
      })
      .catch((error) => {
        updateCheck("Manifest", "fail", error instanceof Error ? error.message : "Manifest could not be loaded.");
      });

    fetch("/brand/churchwork-app-icon-512.png", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Icon returned ${response.status}`);
        updateCheck("App icon", "pass", "512px app icon is reachable.");
      })
      .catch((error) => {
        updateCheck("App icon", "fail", error instanceof Error ? error.message : "App icon could not be loaded.");
      });

    if (!("serviceWorker" in navigator)) {
      updateCheck("Service worker", "fail", "This browser does not support service workers.");
    } else {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then((registration) => {
          if (!isMounted) return;
          if (navigator.serviceWorker.controller) {
            updateCheck("Service worker", "pass", `Service worker active: ${registration.scope}`);
          } else {
            updateCheck("Service worker", "fail", "Service worker registered, but this tab is not controlled yet. Refresh once.");
          }
        })
        .catch((error) => {
          updateCheck("Service worker", "fail", error instanceof Error ? error.message : "Service worker registration failed.");
        });
    }

    const fallbackTimer = window.setTimeout(() => {
      updateCheck("Native install prompt", deferredPrompt ? "pass" : "fail", deferredPrompt ? "Chrome has made the real install button available." : "Chrome has not released the native install prompt on this visit yet.");
    }, 5000);

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  async function installChurchWork() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice.catch(() => null);
    setInstallOutcome(choice ? `Install outcome: ${choice.outcome}` : "Install prompt closed.");
    setDeferredPrompt(null);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef5f1", color: "#102b38", padding: "24px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
      <section style={{ maxWidth: "760px", margin: "0 auto", display: "grid", gap: "18px" }}>
        <div style={{ border: "1px solid rgba(16,43,56,.12)", background: "white", borderRadius: "28px", padding: "24px", boxShadow: "0 18px 50px rgba(16,43,56,.10)" }}>
          <p style={{ margin: "0 0 8px", textTransform: "uppercase", letterSpacing: ".14em", fontSize: "12px", color: "#56706d", fontWeight: 800 }}>ChurchWork mobile install</p>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(32px, 9vw, 56px)", lineHeight: 1, letterSpacing: "-0.06em" }}>Install test</h1>
          <p style={{ margin: 0, color: "#46605e", fontSize: "17px", lineHeight: 1.55 }}>{summary}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px" }}>
            <button
              type="button"
              onClick={installChurchWork}
              disabled={!nativeInstallReady || standalone}
              style={{ border: 0, borderRadius: "999px", padding: "14px 20px", background: nativeInstallReady && !standalone ? "#082838" : "#a8b6b2", color: "white", fontWeight: 800, fontSize: "15px" }}
            >
              Install ChurchWork
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ border: "1px solid rgba(8,40,56,.2)", borderRadius: "999px", padding: "14px 20px", background: "white", color: "#082838", fontWeight: 800, fontSize: "15px" }}
            >
              Refresh check
            </button>
            <Link href="/admin" style={{ border: "1px solid rgba(8,40,56,.2)", borderRadius: "999px", padding: "14px 20px", background: "white", color: "#082838", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
              Go to Admin
            </Link>
          </div>

          {installOutcome ? <p style={{ margin: "14px 0 0", color: "#46605e", fontWeight: 700 }}>{installOutcome}</p> : null}
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          {checks.map((check) => (
            <div key={check.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "center", border: "1px solid rgba(16,43,56,.10)", background: "white", borderRadius: "18px", padding: "16px" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: 850 }}>{check.label}</p>
                <p style={{ margin: 0, color: "#5a706d", fontSize: "14px", lineHeight: 1.45 }}>{check.detail}</p>
              </div>
              <span style={{ ...statusStyle(check.status), border: "1px solid", borderRadius: "999px", padding: "8px 10px", fontSize: "12px", fontWeight: 850, whiteSpace: "nowrap" }}>
                {statusLabel(check.status)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid rgba(16,43,56,.12)", background: "rgba(255,255,255,.82)", borderRadius: "22px", padding: "18px", color: "#46605e", lineHeight: 1.55 }}>
          <strong style={{ color: "#102b38" }}>Phone test path:</strong> open this page in Android Chrome, wait 5 seconds, tap Refresh check once, then use the Install ChurchWork button if it appears. If it does not, screenshot this page and the failed check will tell us what Chrome is rejecting.
        </div>
      </section>
    </main>
  );
}
