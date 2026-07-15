"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallWindow = Window & {
  __churchworkInstallPrompt?: BeforeInstallPromptEvent;
};

type InstallStatus = "checking" | "ready" | "waiting" | "unsupported";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isLandingPage() {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/";
}

function readCapturedPrompt() {
  if (typeof window === "undefined") return null;
  return (window as InstallWindow).__churchworkInstallPrompt ?? null;
}

export function ChurchWorkInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedThisVisit, setDismissedThisVisit] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [landingPage, setLandingPage] = useState(false);
  const [status, setStatus] = useState<InstallStatus>("checking");

  useEffect(() => {
    setStandalone(isStandaloneMode());
    const onLandingPage = isLandingPage();
    setLandingPage(onLandingPage);

    if (!("serviceWorker" in navigator)) {
      setStatus("unsupported");
    }

    function adoptCapturedPrompt() {
      const installEvent = readCapturedPrompt();
      if (!installEvent) return false;
      setDeferredPrompt(installEvent);
      setDismissedThisVisit(false);
      setStatus("ready");
      return true;
    }

    function markWaiting() {
      if (readCapturedPrompt()) {
        adoptCapturedPrompt();
        return;
      }

      setStatus((current) => (current === "ready" || current === "unsupported" ? current : "waiting"));
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      const installEvent = event as BeforeInstallPromptEvent;
      (window as InstallWindow).__churchworkInstallPrompt = installEvent;
      setDeferredPrompt(installEvent);
      setDismissedThisVisit(false);
      setStatus("ready");
    }

    function handleAppInstalled() {
      (window as InstallWindow).__churchworkInstallPrompt = undefined;
      setDeferredPrompt(null);
      setDismissedThisVisit(true);
      setStandalone(true);
    }

    adoptCapturedPrompt();
    const retryOne = window.setTimeout(adoptCapturedPrompt, 500);
    const retryTwo = window.setTimeout(adoptCapturedPrompt, 1500);
    const waitingCheck = window.setTimeout(markWaiting, 3500);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("churchwork-install-prompt-ready", adoptCapturedPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.clearTimeout(retryOne);
      window.clearTimeout(retryTwo);
      window.clearTimeout(waitingCheck);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("churchwork-install-prompt-ready", adoptCapturedPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    const installEvent = deferredPrompt ?? readCapturedPrompt();
    if (!installEvent) {
      setStatus("waiting");
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice.catch(() => undefined);
    (window as InstallWindow).__churchworkInstallPrompt = undefined;
    setDeferredPrompt(null);
    setDismissedThisVisit(true);
  }

  function handleDismiss() {
    setDismissedThisVisit(true);
  }

  if (!landingPage || standalone || dismissedThisVisit) return null;

  const ready = status === "ready" && Boolean(deferredPrompt ?? readCapturedPrompt());
  const statusText = ready
    ? "Install button ready"
    : status === "unsupported"
      ? "This browser does not support PWA install prompts"
      : status === "waiting"
        ? "Waiting for Chrome to release the install prompt"
        : "Checking install readiness";

  return (
    <aside className="churchwork-install-prompt" aria-label="Install ChurchWork app">
      <div>
        <p className="churchwork-install-prompt__eyebrow">Install ChurchWork</p>
        <p className="churchwork-install-prompt__copy">
          Add ChurchWork to this device for the app-style pilot experience.
        </p>
        <p className="churchwork-install-prompt__status">Status: {statusText}</p>
      </div>
      <div className="churchwork-install-prompt__actions">
        <button type="button" onClick={handleInstall} disabled={!ready} className="churchwork-install-prompt__primary">
          Install
        </button>
        <button type="button" onClick={handleDismiss} className="churchwork-install-prompt__secondary" aria-label="Dismiss install prompt">
          Not now
        </button>
      </div>
    </aside>
  );
}
