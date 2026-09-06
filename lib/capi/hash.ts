import { createHash } from 'crypto';

/**
 * يهيّئ قيمة لمطابقة مستخدم عبر Conversions API حسب متطلّبات ميتا:
 * إزالة الفراغات، تحويل لحروف صغيرة، ثمّ SHA-256 بصيغة hex.
 * راجع: API Parameters → user_data (advanced matching).
 */
export function hashForMeta(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHash('sha256').update(normalized).digest('hex');
}

/** يحوّل رقماً جزائرياً محلياً (0XXXXXXXXX) إلى E.164 بلا علامة + كما تتطلّبه ميتا قبل التجزئة. */
export function dzPhoneToE164(localPhone: string): string {
  return '213' + localPhone.slice(1);
}
