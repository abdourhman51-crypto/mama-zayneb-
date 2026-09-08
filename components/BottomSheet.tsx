'use client';

import { useEffect, useRef, useState } from 'react';
import { bottomSheet, form } from '@/content/site';
import { isValidDzPhone } from '@/lib/phone';
import { LEAD_SHEET_EVENT } from '@/lib/leadSheet';
import { trackEvent, readFbCookies } from '@/lib/pixel';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * الورقة السفلية — اختصار الاستمارة على الهاتف.
 *
 * لماذا: أغلب الزوّار يأتون من الهاتف، والتمرير إلى أسفل الصفحة
 * حاجز حقيقي. حقلان فقط (الاسم والرقم) داخل ورقة تنفتح بضغطة.
 *
 * قواعد مطبَّقة: الحركة transform فقط، Escape يغلق، التركيز يعود
 * إلى الزرّ، التمرير خلف الورقة مقفول، وهي مخفيّة تماماً على
 * الحاسوب حيث الاستمارة الكاملة ظاهرة أصلاً.
 */
export default function BottomSheet() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // تُفتح من أزرار الدعوة نفسها (الشريط العلوي وشريط الإلحاح) —
  // لا زرّ عائم ثالث يزاحم زرّ واتساب ويكرّر اللون الوردي.
  useEffect(() => {
    const onOpen = () => {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener(LEAD_SHEET_EVENT, onOpen);
    return () => window.removeEventListener(LEAD_SHEET_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    setOpen(false);
    returnFocusRef.current?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const parentName = String(fd.get('parent_name') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();

    if (parentName.length < 2) return setError(form.errorName);
    if (!isValidDzPhone(phone)) return setError(form.errorPhone);
    setError(null);
    setStatus('loading');

    const params = new URLSearchParams(window.location.search);
    const eventId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const { fbp, fbc } = readFbCookies();

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_name: parentName,
          phone,
          child_age: null,
          desired_start: null,
          note: null,
          website: '',
          utm_source: params.get('utm_source'),
          utm_campaign: params.get('utm_campaign'),
          event_id: eventId,
          event_source_url: window.location.href,
          fbp,
          fbc,
        }),
      });
      if (!res.ok) throw new Error('request failed');
      trackEvent('Lead', { content_name: 'creche_call_request_sheet' }, eventId);
      setStatus('success');
    } catch {
      setStatus('error');
      setError(form.errorMessage);
    }
  }

  const fieldClass =
    'focus-ring w-full rounded-2xl border border-ink/12 bg-white px-5 py-3.5 font-body text-base text-ink transition-colors duration-200 placeholder:text-ink/35';

  return (
    <div className="lg:hidden">
      {/* تُركَّب دائماً لتُتاح الحركة عند الفتح والإغلاق */}
      <div className={open ? '' : 'pointer-events-none'} aria-hidden={!open}>
        <div
          className="sheet-backdrop fixed inset-0 z-[70] bg-ink/45"
          data-open={open}
          onClick={close}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={bottomSheet.title}
          data-open={open}
          className="sheet-panel fixed inset-x-0 bottom-0 z-[71] rounded-t-[28px] bg-card p-6 pb-8 shadow-soft"
        >
          <span className="mx-auto mb-5 block h-1.5 w-11 rounded-full bg-ink/15" aria-hidden="true" />

          {status === 'success' ? (
            <div role="status" aria-live="polite" className="py-4 text-center">
              <h2 className="font-heading text-lg leading-[1.6] text-ink">{form.successTitle}</h2>
              <p className="mt-3 text-[0.95rem] leading-[2] text-ink-soft">{form.successBody}</p>
              <button
                type="button"
                onClick={close}
                className="focus-ring tap-feedback mt-6 rounded-full bg-ink px-6 py-3 font-heading text-sm text-white"
              >
                {bottomSheet.close}
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-heading text-xl leading-[1.5] text-ink">{bottomSheet.title}</h2>
              <p className="mt-2 text-[0.9rem] leading-[1.9] text-ink-soft">{bottomSheet.subtitle}</p>

              <form onSubmit={onSubmit} noValidate className="mt-5 space-y-3">
                <input
                  ref={firstFieldRef}
                  id="sheet_parent_name"
                  name="parent_name"
                  type="text"
                  autoComplete="name"
                  tabIndex={open ? 0 : -1}
                  placeholder={form.placeholders.parentName}
                  aria-label={form.labels.parentName}
                  className={fieldClass}
                />
                <input
                  id="sheet_phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  tabIndex={open ? 0 : -1}
                  placeholder={form.placeholders.phone}
                  aria-label={form.labels.phone}
                  className={`${fieldClass} text-start`}
                />

                {error ? (
                  <p role="alert" className="text-sm leading-[1.9] text-pink-deep">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  tabIndex={open ? 0 : -1}
                  className="focus-ring tap-feedback w-full rounded-2xl bg-pink px-6 py-4 font-heading text-base text-white transition-colors hover:bg-pink-deep disabled:opacity-60"
                >
                  {status === 'loading' ? form.submitting : form.submit}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between">
                <a
                  href="#form"
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                  className="focus-ring text-sm text-ink-soft underline underline-offset-4"
                >
                  {bottomSheet.fullFormLink}
                </a>
                <button
                  type="button"
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                  className="focus-ring text-sm text-ink-soft"
                >
                  {bottomSheet.close}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
