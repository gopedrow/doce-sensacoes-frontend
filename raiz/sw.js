const CACHE_NAME = 'doce-sensacoes-v2';
const urlsToCache = [
  './',
  './index.html',
  './cadastro.html',
  './login.html',
  './perfil.html',
  './styles/styles.css',
  './styles/header.css',
  './styles/home.css',
  './styles/menu.css',
  './styles/testimonials.css',
  './styles/footer.css',
  './styles/pwa.css',
  './javascript/script.js',
  './javascript/api-connection.js',
  './javascript/login.js',
  './images/hero.png',
  './images/avatar.png',
  './images/chef.png',
  './images/dish.png',
  './images/dish2.png',
  './images/dish3.png',
  './images/dish4.png',
  './images/icon-192.png',
  './images/icon-512.png',
  './manifest.json'
];

// Instalar service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retorna cache se encontrado
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Atualizar cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 