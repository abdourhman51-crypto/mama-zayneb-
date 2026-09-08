/**
 * جسر فتح الورقة السفلية.
 *
 * على الهاتف، أزرار الدعوة لا تقفز إلى أسفل الصفحة بل تفتح ورقة
 * بحقلين. حدث مخصّص على window بدل تمرير الحالة عبر الشجرة كلّها —
 * لا مزوّد سياق ولا إعادة تصيير للصفحة.
 */
export const LEAD_SHEET_EVENT = 'lead-sheet:open';

/** يفتح الورقة على الشاشات الصغيرة فقط. يُرجع true إن تولّى الأمر. */
export function openLeadSheetOnMobile(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(min-width: 1024px)').matches) return false;
  window.dispatchEvent(new CustomEvent(LEAD_SHEET_EVENT));
  return true;
}
