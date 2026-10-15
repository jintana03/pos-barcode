const CACHE = 'barcode-root-v2';
self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key === 'barcode-pos-v1').map((key) => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (!requestUrl.pathname.endsWith('/POS-BARCODE/') && !requestUrl.pathname.endsWith('/POS-BARCODE/index.html')) return;
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match('./index.html')));
});
