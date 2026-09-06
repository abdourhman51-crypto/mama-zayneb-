// ─────────────────────────────────────────────────────────────
//  Meta Pixel — لا يُحمّل إلا بعد أول تفاعل من الزائر
//  (تمرير، لمس، ضغطة مفتاح، أو نقرة) حفاظاً على سرعة الصفحة.
// ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; callMethod?: unknown };
    _fbq?: unknown;
  }
}

// معرّف بيكسل روضة ماما زينب. متغيّر البيئة يتقدّم عليه إن وُجد،
// وإلّا يُستعمل هذا المعرّف مباشرة (معرّفات البيكسل ليست سرّية —
// تظهر في مصدر الصفحة لأي زائر).
const FALLBACK_PIXEL_ID = '2615027122286387';
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || FALLBACK_PIXEL_ID;

let loading = false;
let loaded = false;

export function isPixelConfigured() {
  return Boolean(PIXEL_ID);
}

/** يحمّل سكربت البيكسل مرة واحدة ويطلق PageView. */
export function loadPixel() {
  if (loaded || loading || !PIXEL_ID || typeof window === 'undefined') return;
  loading = true;

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq?.('init', PIXEL_ID);
  window.fbq?.('track', 'PageView');
  loaded = true;
  loading = false;
}

/**
 * يطلق حدثاً؛ يحمّل البيكسل أولاً إن لم يكن محمّلاً.
 * مرّر eventId نفسه المُرسَل إلى /api/lead حتى تُزيل ميتا التكرار بين
 * حدث المتصفّح (هذا) وحدث الخادم (Conversions API) لنفس عملية التسجيل.
 */
export function trackEvent(name: string, params?: Record<string, unknown>, eventId?: string) {
  if (!PIXEL_ID || typeof window === 'undefined') return;
  loadPixel();
  if (eventId) window.fbq?.('track', name, params, { eventID: eventId });
  else window.fbq?.('track', name, params);
}

/** قيمتا ملفَّي تعريف ميتا (fbp/fbc) من كوكيز المتصفّح — لتحسين مطابقة الأحداث في CAPI. */
export function readFbCookies(): { fbp: string | null; fbc: string | null } {
  if (typeof document === 'undefined') return { fbp: null, fbc: null };
  const read = (name: string) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };
  return { fbp: read('_fbp'), fbc: read('_fbc') };
}
