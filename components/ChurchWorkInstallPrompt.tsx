"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type AccountState = "checking" | "signed_in" | "signed_out";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isAdminInstallPath() {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/admin" || window.location.pathname === "/pilot";
}

function isAndroidChrome() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes("android") && ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr");
}

function isIosSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = ua.includes("safari") && !ua.includes("crios") && !ua.includes("fxios") && !ua.includes("edgios");
  return isIos && isSafari;
}

export function ChurchWorkInstallPrompt() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedThisVisit, setDismissedThisVisit] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [accountState, setAccountState] = useState<AccountState>("checking");
  const [adminInstallPath, setAdminInstallPath] = useState(false);
  const [androidChrome, setAndroidChrome] = useState(false);
  const [iosSafari, setIosSafari] = useState(false);

  useEffect(() => {
    setStandalone(isStandaloneMode());
    setAdminInstallPath(isAdminInstallPath());
    setAndroidChrome(isAndroidChrome());
    setIosSafari(isIosSafari());

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

  const isSignedInAdminTest = adminInstallPath && accountState === "signed_in";
  const canShowInstallHelp = Boolean(deferredPrompt) || androidChrome || iosSafari;

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

  if (standalone || accountState === "checking" || dismissedThisVisit || !isSignedInAdminTest || !canShowInstallHelp) return null;

  const hasNativeInstallPrompt = Boolean(deferredPrompt);

  return (
    <aside className="churchwork-install-prompt" aria-label="Install ChurchWork app">
      <div>
        <p className="churchwork-install-prompt__eyebrow">Install ChurchWork</p>
        <p className="churchwork-install-prompt__copy">
          {hasNativeInstallPrompt
            ? "Install ChurchWork on this device so you can test the signed-in app shell from your phone."
            : androidChrome
              ? "For this phone test, stay signed in here, then tap Chrome’s three-dot menu and choose Install app. If Chrome only shows Add to Home screen, Chrome has not accepted the PWA install yet."
              : "On iPhone or iPad, stay signed in here, then use Share and Add to Home Screen to test the app-style shell."}
        </p>
      </div>
      <div className="churchwork-install-prompt__actions">
        {hasNativeInstallPrompt ? (
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
