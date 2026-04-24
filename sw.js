// sw.js - Service Worker for PWA
// 实现离线缓存，让APP可以在没有网络时使用

const CACHE_NAME = 'todo-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// 安装 Service Worker - 缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 缓存资源');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活 Service Worker - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 请求拦截 - 从缓存返回或网络请求
self.addEventListener('fetch', (event) => {
  // 只处理同源的请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // 不缓存非成功的响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应并缓存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 离线时返回缓存的首页
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('离线', { status: 503 });
          });
      })
  );
});

// 推送通知 (未来扩展用)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png'
    });
  }
});
