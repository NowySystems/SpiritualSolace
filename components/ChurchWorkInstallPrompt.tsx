"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type AccountState = "checking" | "signed_in" | "signed_out";

const INSTALL_DISMISSAL_KEY = "churchwork:pwa-install-dismissed";

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

function isAndroidChrome() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes("android") && ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr");
}

function isAdminInstallPath() {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/admin" || window.location.pathname === "/pilot";
}

export function ChurchWorkInstallPrompt() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedThisVisit, setDismissedThisVisit] = useState(false);
  const [dismissedPersistently, setDismissedPersistently] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [accountState, setAccountState] = useState<AccountState>("checking");
  const [adminInstallPath, setAdminInstallPath] = useState(false);
  const [androidChrome, setAndroidChrome] = useState(false);
  const showIosHelp = useMemo(() => isIosSafari(), []);

  useEffect(() => {
    setStandalone(isStandaloneMode());
    setAdminInstallPath(isAdminInstallPath());
    setAndroidChrome(isAndroidChrome());
    setDismissedPersistently(window.localStorage.getItem(INSTALL_DISMISSAL_KEY) === "true");

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setAccountState(data.session ? "signed_in" : "signed_out");
      })
      .catch(() => {
        if (!isMounted) return;
        setAccountState("signed_out");
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountState(session ? "signed_in" : "signed_out");
      setDismissedThisVisit(false);
    });

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [supabase]);

  const isSignedOut = accountState === "signed_out";
  const shouldRespectPersistentDismissal = accountState === "signed_in" && !adminInstallPath;
  const dismissed = dismissedThisVisit || (shouldRespectPersistentDismissal && dismissedPersistently);
  const showManualAndroidHelp = androidChrome && (adminInstallPath || isSignedOut);
  const canShowPrompt = Boolean(deferredPrompt) || showIosHelp || showManualAndroidHelp;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => undefined);
    setDeferredPrompt(null);
    setDismissedThisVisit(true);

    if (!isSignedOut && !adminInstallPath) {
      setDismissedPersistently(true);
      window.localStorage.setItem(INSTALL_DISMISSAL_KEY, "true");
    }
  }

  function handleDismiss() {
    setDismissedThisVisit(true);

    if (!isSignedOut && !adminInstallPath) {
      setDismissedPersistently(true);
      window.localStorage.setItem(INSTALL_DISMISSAL_KEY, "true");
    }
  }

  if (standalone || accountState === "checking" || dismissed || !canShowPrompt) return null;

  const hasNativeInstallPrompt = Boolean(deferredPrompt);

  return (
    <aside className="churchwork-install-prompt" aria-label="Install ChurchWork app">
      <div>
        <p className="churchwork-install-prompt__eyebrow">Install ChurchWork</p>
        <p className="churchwork-install-prompt__copy">
          {hasNativeInstallPrompt
            ? isSignedOut
              ? "Add ChurchWork to this device before creating an account. It helps us validate real app use during the pilot."
              : adminInstallPath
                ? "Install or reinstall ChurchWork from this admin device for the cleanest app-style testing path."
                : "Add ChurchWork to this device for a cleaner pilot app experience."
            : showManualAndroidHelp
              ? "Chrome has not opened the native install button yet. Tap the three-dot menu, then choose Install app or Add to Home screen."
              : isSignedOut
                ? "On iPhone or iPad, use Share, then Add to Home Screen before creating an account. It helps validate the app-style pilot."
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
          {hasNativeInstallPrompt ? "Not now" : "Got it"}
        </button>
      </div>
    </aside>
  );
}
