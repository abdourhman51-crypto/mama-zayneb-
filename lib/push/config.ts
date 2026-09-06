/**
 * مفتاح VAPID العام. عام بطبيعته — يُرسَل إلى متصفّح كل مشترِك.
 * المفتاح الخاص يبقى في متغيّر بيئة على الخادم فقط.
 */
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BG3ZZgA5NZU49s3zJAlpjXWpRI0VYYOvWsrf-3NkglRareh3F-C8ML5d8awvQvEdHe134oGGCrKDUohKEpBezG0';

/** جهة الاتصال التي يبلّغها مزوّد الدفع عند وجود مشكلة. */
export const VAPID_SUBJECT = 'mailto:mamazayneb83@gmail.com';
