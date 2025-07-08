const CACHE_NAME = 'doce-sensacoes-v1';
const urlsToCache = [
  '/',
  '/doce-sensacoes-frontend/',
  '/doce-sensacoes-frontend/index.html',
  '/doce-sensacoes-frontend/styles/styles.css',
  '/doce-sensacoes-frontend/styles/pwa.css',
  '/doce-sensacoes-frontend/javascript/script.js',
  '/doce-sensacoes-frontend/javascript/api-connection.js',
  '/doce-sensacoes-frontend/images/icon-192.png',
  '/doce-sensacoes-frontend/images/icon-512.png',
  // Adicione aqui outros arquivos importantes do seu site
];

// ✅ Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Força ativação imediata
});

// ✅ Ativa o novo Service Worker e limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Pega controle imediato das abas
});

// ✅ Intercepta todas as requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se encontrou no cache, retorna
      if (response) {
        return response;
      }

      // Senão, tenta buscar da rede
      return fetch(event.request).catch(() => {
        // Se a rede falhar (ex: rota quebrada no modo app), devolve index.html
        return caches.match('/doce-sensacoes-frontend/index.html');
      });
    })
  );
}); 