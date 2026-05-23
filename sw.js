const CACHE_NAME = 'mental-quiz-v1';
const ASSETS = [
  'index.html',
  'index.tecnologia.js',
  'index.natureza.js',
  'index.historia.js',
  'index.culturapop.js',
  'manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estratégia de Fetch: Cache primeiro para arquivos de texto, Rede para vídeos
self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  
  // Se for um vídeo, busca direto da rede para manter o app leve
  if (url.includes('.mp4')) {
    e.respondWith(fetch(e.request));
  } else {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        return cachedResponse || fetch(e.request);
      })
    );
  }
});
