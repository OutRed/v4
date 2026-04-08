/* ═══════════════════════════════════════════════════════════════
   OutRed — Service Worker (sw.js)
   Offline caching for core assets
═══════════════════════════════════════════════════════════════ */

const CACHE_NAME  = 'outred-v1';
const CACHE_PAGES = 'outred-pages-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/games.html',
  '/apps.html',
  '/css/style.css',
  '/js/core.js',
  '/js/games.js',
  '/assets/json/games.json',
  '/assets/json/apps.json',
  '/assets/json/manifest.json',
  '/assets/favicon.png',
  '/assets/img/no-img.jpg',
  '/404.html',
];

// Install: cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== CACHE_PAGES).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for pages, cache-first for assets
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET and external requests
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  // Skip game assets (too large to cache)
  if (url.pathname.startsWith('/g/assets/')) return;

  // Cache-first for static files (css, js, images, fonts)
  if (/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        });
      }).catch(() => caches.match('/assets/img/no-img.jpg'))
    );
    return;
  }

  // Network-first for HTML pages
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_PAGES).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request)
          .then(cached => cached || caches.match('/offline.html') || caches.match('/404.html'))
      )
  );
});
