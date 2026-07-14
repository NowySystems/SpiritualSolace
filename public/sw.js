const CHURCHWORK_CACHE = "churchwork-shell-v9";
const OFFLINE_URL = "/offline";
const SHELL_ASSETS = [
  "/",
  "/admin",
  "/pilot",
  "/install",
  "/requester-portal",
  "/facility-portal",
  "/partner-portal",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/brand/churchwork-app-icon-192.png",
  "/brand/churchwork-app-icon-512.png",
  "/brand/churchwork-app-icon-maskable-512.png",
  "/brand/apple-touch-icon.png",
  "/brand/churchwork-corner-logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CHURCHWORK_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CHURCHWORK_CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.includes("supabase")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        if (
          response.ok &&
          (request.destination === "document" ||
            request.destination === "style" ||
            request.destination === "script" ||
            request.destination === "image" ||
            url.pathname === "/manifest.webmanifest")
        ) {
          caches.open(CHURCHWORK_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
        }
        return response;
      })
      .catch(() => {
        if (request.destination === "document") {
          return caches.match(OFFLINE_URL).then((cached) => cached || caches.match("/admin") || caches.match("/pilot") || caches.match("/install"));
        }
        return caches.match(request);
      })
  );
});
