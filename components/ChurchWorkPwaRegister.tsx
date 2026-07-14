"use client";

import { useEffect } from "react";

export function ChurchWorkPwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Keep PWA registration non-blocking. The app should still run if registration fails.
      });
    });
  }, []);

  return null;
}
