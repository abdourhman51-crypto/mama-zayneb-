'use client';

import { useEffect, useRef, useState } from 'react';
import { form, contact, cta } from '@/content/site';
import { isValidDzPhone } from '@/lib/phone';
import { trackEvent } from '@/lib/pixel';
import { Dots, WhatsAppLink } from './Ui';

type Status = 'idle' | 'loading' | 'success' | 'error';

const fieldClass =
  'focus-ring w-full rounded-2xl border border-ink/12 bg-white px-5 py-4 font-body text-base text-ink shadow-soft-sm transition-colors duration-200 placeholder:text-ink/35 hover:border-ink/20';

export default function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewedRef = useRef(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  // ViewContent عند وصول الزائر إلى قسم الاستمارة
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !viewedRef.current) {
            viewedRef.current = true;
            trackEvent('ViewContent', { content_name: 'lead_form' });
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);

    const parentName = String(fd.get('parent_name') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const childAge = String(fd.get('child_age') ?? '');
    const desiredStart = String(fd.get('desired_start') ?? '');
    const note = String(fd.get('note') ?? '').trim();
    const website = String(fd.get('website') ?? ''); // honeypot

    const nextErrors: Record<string, string> = {};
    if (parentName.length < 2) nextErrors.parent_name = form.errorName;
    if (!isValidDzPhone(phone)) nextErrors.phone = form.errorPhone;
    if (!childAge) nextErrors.child_age = form.errorRequired;
    if (!desiredStart) nextErrors.desired_start = form.errorRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = document.getElementById(Object.keys(nextErrors)[0]);
      first?.focus();
      return;
    }

    setStatus('loading');

    const params = new URLSearchParams(window.location.search);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_name: parentName,
          phone,
          child_age: childAge,
          desired_start: desiredStart,
          note: note || null,
          website,
          utm_source: params.get('utm_source'),
          utm_campaign: params.get('utm_campaign'),
        }),
      });

      if (!res.ok) throw new Error('request failed');

      trackEvent('Lead', { content_name: 'creche_call_request' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="form"
      ref={sectionRef}
      className="scroll-mt-24 bg-pink/[0.07] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center gap-5 text-center">
            <Dots />
            <h2 className="font-heading text-[1.75rem] leading-[1.35] text-ink sm:text-4xl sm:leading-[1.3]">
              {form.title}
            </h2>
            <p className="max-w-xl text-base leading-[2] text-ink-soft sm:text-lg">{form.subtitle}</p>
          </div>

          <div className="mt-10 rounded-[32px] bg-card p-6 shadow-soft sm:mt-12 sm:p-10">
            {status === 'success' ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="focus-ring rounded-2xl py-6 text-center"
              >
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green/20 text-green" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4 12.5 5 5L20 7" />
                  </svg>
                </span>
                <h3 className="mt-6 font-heading text-xl leading-[1.6] text-ink sm:text-2xl">
                  {form.successTitle}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-base leading-[2.05] text-ink-soft">
                  {form.successBody}
                </p>
                <div className="mt-7 flex justify-center">
                  <WhatsAppLink href={contact.whatsapp} label={cta.whatsapp} />
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                {/* حقل مخفي ضد الإرسال الآلي — لا يراه الزائر */}
                <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">لا تملأ هذا الحقل</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <Field id="parent_name" label={form.labels.parentName} error={errors.parent_name}>
                  <input
                    id="parent_name"
                    name="parent_name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={form.placeholders.parentName}
                    aria-invalid={Boolean(errors.parent_name)}
                    aria-describedby={errors.parent_name ? 'parent_name-error' : undefined}
                    className={fieldClass}
                  />
                </Field>

                <Field id="phone" label={form.labels.phone} error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    dir="ltr"
                    autoComplete="tel"
                    placeholder={form.placeholders.phone}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`${fieldClass} text-start`}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="child_age" label={form.labels.childAge} error={errors.child_age}>
                    <select
                      id="child_age"
                      name="child_age"
                      required
                      defaultValue=""
                      aria-invalid={Boolean(errors.child_age)}
                      aria-describedby={errors.child_age ? 'child_age-error' : undefined}
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        اختر…
                      </option>
                      {form.childAgeOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="desired_start" label={form.labels.desiredStart} error={errors.desired_start}>
                    <select
                      id="desired_start"
                      name="desired_start"
                      required
                      defaultValue=""
                      aria-invalid={Boolean(errors.desired_start)}
                      aria-describedby={errors.desired_start ? 'desired_start-error' : undefined}
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        اختر…
                      </option>
                      {form.desiredStartOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field id="note" label={form.labels.note}>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    placeholder={form.placeholders.note}
                    className={`${fieldClass} resize-none`}
                  />
                </Field>

                {status === 'error' ? (
                  <p role="alert" className="rounded-2xl bg-pink/10 px-5 py-4 text-sm leading-[1.9] text-pink-deep">
                    {form.errorMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="focus-ring w-full rounded-2xl bg-pink px-8 py-4 font-heading text-lg text-white shadow-soft transition-all duration-300 hover:bg-pink-deep disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {status === 'loading' ? form.submitting : form.submit}
                </button>

                <p className="text-center text-sm leading-[1.9] text-ink-soft">
                  أو اتصل مباشرة على{' '}
                  <a href={contact.phoneTel} className="focus-ring rounded font-heading text-ink underline decoration-pink/40 underline-offset-4 hover:text-pink" dir="ltr">
                    {contact.phoneDisplay}
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-heading text-sm text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-pink-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}
