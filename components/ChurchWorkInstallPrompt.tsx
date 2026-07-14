"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

export function ChurchWorkInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedThisVisit, setDismissedThisVisit] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(isStandaloneMode());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setDismissedThisVisit(false);
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
      setDismissedThisVisit(true);
      setStandalone(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => undefined);
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
