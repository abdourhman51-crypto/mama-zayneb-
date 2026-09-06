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

function sameApplicationServerKey(sub: PushSubscription): boolean {
  const current = sub.options?.applicationServerKey;
  if (!current) return false;
  const expected = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  const a = new Uint8Array(current);
  if (a.length !== expected.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== expected[i]) return false;
  return true;
}

/**
 * هل يوجد اشتراك فعليّ ومحفوظ فعلاً على الخادم لهذا الجهاز؟
 * لا نثق بـNotification.permission وحده — قد يكون «granted» من محاولة
 * سابقة فشل فيها حفظ الاشتراك (شبكة، أو مفتاح VAPID تغيّر لاحقاً).
 */
export async function hasActiveSubscription(): Promise<boolean> {
  if (readPushState() !== 'granted') return false;
  try {
    const registration = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!registration) return false;
    const subscription = await registration.pushManager.getSubscription();
    return Boolean(subscription && sameApplicationServerKey(subscription));
  } catch {
    return false;
  }
}

/**
 * يطلب الإذن، يسجّل عامل الخدمة، ويحفظ الاشتراك في الخادم.
 * يعيد رسالة الخطأ عند الفشل، أو null عند النجاح الكامل والمؤكَّد.
 *
 * ملاحظة مهمّة: إن كان هناك اشتراك سابق بمفتاح VAPID مختلف (مثلاً بعد
 * تغيير المفتاح في بيئة النشر)، يُلغى ويُعاد الاشتراك — وإلا يظهر الإذن
 * «ممنوح» في المتصفّح بينما الإشعارات الفعلية تفشل صامتة عند هذا الجهاز
 * تحديداً، وهو ما يفسّر عمل الإشعار على جهاز وعدم عمله على آخر.
 */
export async function enablePush(): Promise<string | null> {
  if (readPushState() === 'unsupported') return 'المتصفّح لا يدعم الإشعارات.';

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return 'لم يُمنَح الإذن.';

  let registration: ServiceWorkerRegistration;
  try {
    registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
  } catch {
    return 'تعذّر تسجيل عامل الخدمة. أعد تحميل الصفحة وحاول مجدداً.';
  }

  let subscription: PushSubscription | null;
  try {
    const existing = await registration.pushManager.getSubscription();
    if (existing && !sameApplicationServerKey(existing)) {
      await existing.unsubscribe();
      subscription = null;
    } else {
      subscription = existing;
    }

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
  } catch {
    return 'رفض المتصفّح تفعيل الإشعارات على هذا الجهاز.';
  }

  try {
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent.slice(0, 300),
      }),
    });
    if (!res.ok) return 'تعذّر حفظ الاشتراك على الخادم.';
  } catch {
    return 'تحقّق من اتصالك بالإنترنت وحاول مرة أخرى.';
  }

  return null;
}
