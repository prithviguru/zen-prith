// Zen service worker.
//
// The page itself is fetched network-first: it is a few KB, and serving it
// from cache meant every update arrived a launch late — or never, since an
// installed app that is resumed rather than cold-started may not request the
// page at all. Everything else (audio, icons) is cache-first with a
// background refresh, since those are large and rarely change.
//
// Offline still works: a failed page fetch falls back to the cached copy.

const CACHE = "zen-v27";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./bell.wav",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(e.request).then((r) => r || caches.match("./index.html")).then((r) => r || caches.match("./"))
        )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const refresh = fetch(e.request)
        .then((res) => {
          if (res.ok && (res.type === "basic" || res.type === "cors")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || refresh;
    })
  );
});
