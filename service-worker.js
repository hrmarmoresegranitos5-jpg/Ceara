// service-worker.js — Ceará Planejados
const CACHE_NAME = 'cear-v2';
const ASSETS = [
  './',
  './index.html',
  './cear-dados.js',
  './cear-db.js',
  './cear-helpers.js',
  './cear-home.js',
  './cear-cad.js',
  './cear-orc.js',
  './cear-financeiro.js',
  './cear-historico.js',
  './cear-clientes.js',
  './cear-config.js',
  './cear-modais.js',
  './cear-app.js',
];

// Instala e cacheia
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

// Apaga caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first para HTML, cache-first para o resto
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  }
});
