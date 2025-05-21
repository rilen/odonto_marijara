```
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('odonto-cache-v3').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icon.png',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['odonto-cache-v3'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```
