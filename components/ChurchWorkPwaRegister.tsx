"use client";

import { useEffect } from "react";

const PWA_RELOAD_KEY = "churchwork:pwa-controller-reload-v2";

function isPwaEntryPath() {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/" || window.location.pathname === "/admin" || window.location.pathname === "/pilot";
}

function reloadOnceWhenControlled() {
  if (!isPwaEntryPath()) return;
  if (sessionStorage.getItem(PWA_RELOAD_KEY) === "true") return;
  if (!navigator.serviceWorker.controller) return;

  sessionStorage.setItem(PWA_RELOAD_KEY, "true");
  window.location.reload();
}

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

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (worker.state === "activated") {
              reloadOnceWhenControlled();
            }
          });
        });

        reloadOnceWhenControlled();
      } catch {
        // Keep PWA registration non-blocking. The app should still run if registration fails.
      }
    }

    window.addEventListener("load", registerServiceWorker);

    navigator.serviceWorker.addEventListener("controllerchange", reloadOnceWhenControlled);

    return () => {
      window.removeEventListener("load", registerServiceWorker);
      navigator.serviceWorker.removeEventListener("controllerchange", reloadOnceWhenControlled);
    };
  }, []);

  return null;
}
