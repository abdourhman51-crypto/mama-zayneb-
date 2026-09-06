/* عامل الخدمة — يستقبل الإشعارات الفورية حتى والمنصّة مغلقة. */

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'تسجيل جديد', body: 'وصل طلب مكالمة جديد.' };
  }

  const title = payload.title || 'تسجيل جديد';
  const options = {
    body: payload.body || '',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    dir: 'rtl',
    lang: 'ar',
    tag: payload.tag || 'new-lead',
    renotify: true,
    requireInteraction: true,
    data: { url: payload.url || '/dashboard' },
    actions: [{ action: 'open', title: 'افتح التسجيل' }],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes('/dashboard') && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
