import { normalizeDzPhone } from './phone';

/**
 * نطاق داخلي يحوّل رقم الهاتف إلى هوية دخول عند Supabase.
 * لا يُرسَل إليه أي بريد إطلاقاً — هو مجرّد شكل تتطلّبه خدمة المصادقة،
 * ويغنينا عن الاشتراك في مزوّد رسائل SMS.
 */
export const STAFF_LOGIN_DOMAIN = 'staff.mamazayneb.dz';

/** يحوّل ما كتبه المستخدم إلى هوية الدخول، أو null إن كان الرقم غير صالح. */
export function phoneToLoginIdentity(input: string): string | null {
  const phone = normalizeDzPhone(input);
  return phone ? `${phone}@${STAFF_LOGIN_DOMAIN}` : null;
}
