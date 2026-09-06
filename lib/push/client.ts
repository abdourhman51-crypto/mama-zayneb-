'use client';

import { VAPID_PUBLIC_KEY } from './config';

export type PushState = 'unsupported' | 'default' | 'granted' | 'denied';

export function readPushState(): PushState {
  if (typeof window === 'undefined') return 'unsupported';
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return 'unsupported';
  }
  return Notification.permission as PushState;
}

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(normalized);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/**
 * يطلب الإذن، يسجّل عامل الخدمة، ويحفظ الاشتراك في الخادم.
 * يعيد رسالة الخطأ عند الفشل، أو null عند النجاح.
 */
export async function enablePush(): Promise<string | null> {
  if (readPushState() === 'unsupported') return 'المتصفّح لا يدعم الإشعارات.';

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }));

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent.slice(0, 300),
    }),
  });

  if (!res.ok) return 'تعذّر حفظ الاشتراك على الخادم.';
  return null;
}
