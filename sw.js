// Service worker simple: cachea el shell de la app para que abra offline.
// Sube CACHE_NAME cuando cambies los archivos cacheados (fuerza a los
// navegadores a descartar la copia vieja en vez de quedarse pegados a ella).
const CACHE_NAME = 'entrenamiento-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192-v3.png',
  './icons/icon-512-v3.png',
  './icons/icon-512-maskable-v3.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // El HTML de la página siempre se pide primero a la red (para que los
  // cambios se vean de inmediato) y solo se usa la copia guardada si no
  // hay conexión. Los demás archivos (íconos, manifest) sí son cache-first,
  // ya que casi nunca cambian.
  if(event.request.mode === 'navigate'){
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
