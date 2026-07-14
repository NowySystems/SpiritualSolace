"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallWindow = Window & {
  __churchworkInstallPrompt?: BeforeInstallPromptEvent;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function readCapturedPrompt() {
  if (typeof window === "undefined") return null;
  return (window as InstallWindow).__churchworkInstallPrompt ?? null;
}

export function ChurchWorkInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedThisVisit, setDismissedThisVisit] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(isStandaloneMode());

    function adoptCapturedPrompt() {
      const installEvent = readCapturedPrompt();
      if (!installEvent) return;
      setDeferredPrompt(installEvent);
      setDismissedThisVisit(false);
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      const installEvent = event as BeforeInstallPromptEvent;
      (window as InstallWindow).__churchworkInstallPrompt = installEvent;
      setDeferredPrompt(installEvent);
      setDismissedThisVisit(false);
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
    const retryThree = window.setTimeout(adoptCapturedPrompt, 3000);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("churchwork-install-prompt-ready", adoptCapturedPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.clearTimeout(retryOne);
      window.clearTimeout(retryTwo);
      window.clearTimeout(retryThree);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("churchwork-install-prompt-ready", adoptCapturedPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    const installEvent = deferredPrompt ?? readCapturedPrompt();
    if (!installEvent) return;

    await installEvent.prompt();
    await installEvent.userChoice.catch(() => undefined);
    (window as InstallWindow).__churchworkInstallPrompt = undefined;
    setDeferredPrompt(null);
    setDismissedThisVisit(true);
  }

  function handleDismiss() {
    setDismissedThisVisit(true);
  }

  if (standalone || dismissedThisVisit || !deferredPrompt) return null;

  return (
    <aside className="churchwork-install-prompt" aria-label="Install ChurchWork app">
      <div>
        <p className="churchwork-install-prompt__eyebrow">Install ChurchWork</p>
        <p className="churchwork-install-prompt__copy">
          Add ChurchWork to this device for the app-style pilot experience.
        </p>
      </div>
      <div className="churchwork-install-prompt__actions">
        <button type="button" onClick={handleInstall} className="churchwork-install-prompt__primary">
          Install
        </button>
        <button type="button" onClick={handleDismiss} className="churchwork-install-prompt__secondary" aria-label="Dismiss install prompt">
          Not now
        </button>
      </div>
    </aside>
  );
}
