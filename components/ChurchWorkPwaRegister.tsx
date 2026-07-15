"use client";

import { useEffect } from "react";

export function ChurchWorkPwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        registration.update().catch(() => undefined);
      } catch {
        // Keep PWA registration non-blocking. The app should still run if registration fails.
      }
    }

    window.addEventListener("load", registerServiceWorker);

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return null;
}
