const CACHE_NAME = "swagger-docs-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/openapi.yaml",
    "/swagger-ui/swagger-ui.css",
    "/swagger-ui/swagger-ui-bundle.js",
    "/swagger-ui/swagger-ui-standalone-preset.js",
    "/book_512.png",
    "/docs_256.png",
    "/docs_192.png",
    "/docs_144.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).catch(() => {
                    return caches.match("/index.html");
                })
            );
        })
    );
});
