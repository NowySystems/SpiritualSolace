"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isIosSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = ua.includes("safari") && !ua.includes("crios") && !ua.includes("fxios") && !ua.includes("edgios");
  return isIos && isSafari;
}

export function ChurchWorkInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const showIosHelp = useMemo(() => isIosSafari(), []);

  useEffect(() => {
    setStandalone(isStandaloneMode());

    const storedDismissal = window.localStorage.getItem("churchwork:pwa-install-dismissed");
    if (storedDismissal === "true") {
      setDismissed(true);
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => undefined);
    setDeferredPrompt(null);
    setDismissed(true);
    window.localStorage.setItem("churchwork:pwa-install-dismissed", "true");
  }

  function handleDismiss() {
    setDismissed(true);
    window.localStorage.setItem("churchwork:pwa-install-dismissed", "true");
  }

  if (standalone || dismissed) return null;
  if (!deferredPrompt && !showIosHelp) return null;

  return (
    <aside className="churchwork-install-prompt" aria-label="Install ChurchWork app">
      <div>
        <p className="churchwork-install-prompt__eyebrow">Install ChurchWork</p>
        <p className="churchwork-install-prompt__copy">
          {deferredPrompt
            ? "Add ChurchWork to this device for a cleaner pilot app experience."
            : "On iPhone or iPad, use Share, then Add to Home Screen for the app-style experience."}
        </p>
      </div>
      <div className="churchwork-install-prompt__actions">
        {deferredPrompt ? (
          <button type="button" onClick={handleInstall} className="churchwork-install-prompt__primary">
            Install
          </button>
        ) : null}
        <button type="button" onClick={handleDismiss} className="churchwork-install-prompt__secondary" aria-label="Dismiss install prompt">
          Not now
        </button>
      </div>
    </aside>
  );
}
