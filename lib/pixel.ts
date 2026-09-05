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

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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

/** يطلق حدثاً؛ يحمّل البيكسل أولاً إن لم يكن محمّلاً. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!PIXEL_ID || typeof window === 'undefined') return;
  loadPixel();
  window.fbq?.('track', name, params);
}
