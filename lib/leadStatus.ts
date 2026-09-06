import { leadStatuses } from '@/content/dashboard';

const tones: Record<string, string> = {
  pink: 'bg-pink/12 text-pink-deep',
  blue: 'bg-blue/18 text-ink',
  yellow: 'bg-yellow/25 text-ink',
  green: 'bg-green/22 text-ink',
  muted: 'bg-ink/8 text-ink-soft',
};

/**
 * أصناف لون الحالة.
 * هذا الملف محايد عمداً — بلا توجيه العميل في أعلاه — حتى تستطيع
 * مكوّنات الخادم استدعاء دوالّه. صادرات ملفات العميل تصل إلى الخادم
 * كمراجع لا كدوالّ، واستدعاؤها هناك ينهار وقت التشغيل لا وقت البناء.
 */
export function statusTone(value: string) {
  return tones[leadStatuses.find((s) => s.value === value)?.tone ?? 'muted'];
}

export function statusLabel(value: string) {
  return leadStatuses.find((s) => s.value === value)?.label ?? value;
}
