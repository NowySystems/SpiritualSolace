"use client";

import { useEffect } from "react";

export function ChurchWorkServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          // Keep registration non-blocking. Installability should never break the app.
        });
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return null;
}
