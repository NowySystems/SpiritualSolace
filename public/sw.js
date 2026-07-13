const CHURCHWORK_CACHE = "churchwork-shell-v1";
const SHELL_ASSETS = [
  "/",
  "/requester-portal",
  "/manifest.webmanifest",
  "/pwa/icon.svg",
  "/pwa/maskable-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CHURCHWORK_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CHURCHWORK_CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

function shouldBypassCache(request) {
  const url = new URL(request.url);

  if (request.method !== "GET") return true;
  if (url.origin !== self.location.origin) return true;
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname.startsWith("/auth/")) return true;
  if (url.pathname.includes("supabase")) return true;
  if (url.pathname.includes("_next/webpack-hmr")) return true;

  return false;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (shouldBypassCache(request)) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && networkResponse.type === "basic") {
            const responseClone = networkResponse.clone();
            caches.open(CHURCHWORK_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
