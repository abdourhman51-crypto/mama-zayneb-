/**
 * تحقّق من صيغة رقم الهاتف الجزائري.
 * يقبل: 0771888841 · 0771 88 88 41 · +213771888841 · 00213771888841
 * الشبكات: 05 (أوريدو) · 06 (موبيليس) · 07 (جازي)
 * ويقبل أيضاً الأرقام الثابتة: 0 + رقم ولاية (2-4) + 7 أرقام
 */
export function normalizeDzPhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, '').replace(/^\+/, '00');

  let local: string;
  if (digits.startsWith('00213')) local = '0' + digits.slice(5);
  else if (digits.startsWith('213') && digits.length >= 12) local = '0' + digits.slice(3);
  else local = digits;

  if (!/^\d+$/.test(local)) return null;

  // محمول: 10 أرقام تبدأ بـ 05 / 06 / 07
  if (/^0[567]\d{8}$/.test(local)) return local;
  // ثابت: 9 أرقام تبدأ بـ 0 ثم رقم ولاية (لا يبدأ بـ 0 ولا 5-7)
  if (/^0[1-489]\d{7}$/.test(local)) return local;

  return null;
}

export function isValidDzPhone(input: string): boolean {
  return normalizeDzPhone(input) !== null;
}
