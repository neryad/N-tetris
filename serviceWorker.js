const staticNtrix = 'n-trix-static';

const assets = [
  '/',
  '/index.html',
  '/app.js',
  '/main.css',
  '/manifest.json',
  '/assets',
  '/assets/icon-192x192.png',
  '/assets/icon-256x256.png',
  '/assets/icon-384x384.png',
  '/assets/icon-512x512.png',
];
//* Install service worker */
self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticNtrix).then((cache) => {
      cache.addAll(assets);
    })
  );
});

//** Fecht service worker */

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
