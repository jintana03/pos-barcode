const CACHE = 'barcode-kitpaisan-v65';
const ASSETS = [
  './', './index.html', './sw.js', './barcode-scanner-support.js?v=1', './barcode-stock-policy-support.js?v=3',
  './pos-offline/styles-fixed.css?v=45', './pos-offline/manifest.webmanifest',
  './pos-offline/shop-scope.js?v=2', './pos-offline/persistence-guard.js', './pos-offline/imported-data.js', './pos-offline/catalog-copy-support.js?v=1',
  './pos-offline/category-sync.js', './pos-offline/supabase-client.js?v=60', './pos-offline/auth-support.js?v=53',
  './pos-offline/app.js?v=44', './pos-offline/sku-support.js?v=44', './pos-offline/discount-support.js?v=44',
  './pos-offline/product-search-support.js?v=44', './pos-offline/unit-support.js?v=45',
  './pos-offline/unit-display-support.js?v=44', './pos-offline/receipt-template.js?v=45',
  './pos-offline/cloud-sync.js?v=66', './pos-offline/hidden-products-support.js?v=2'
];
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isPage = url.pathname.endsWith('/kitpaisan/') || url.pathname.endsWith('/kitpaisan/index.html');
  const isCode = isPage || /\.(?:html|js|css)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (isCode) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
