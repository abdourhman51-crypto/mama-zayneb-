'use client';

import { useEffect, useState } from 'react';
import { Check, Share, SquarePlus, X } from 'lucide-react';
import { iosInstall as copy } from '@/content/dashboard';

const DISMISS_KEY = 'mz.ios-install.dismissed';

const icons: Record<string, typeof Share> = { Share, SquarePlus, Check };

function isIosSafari(): boolean {
  const ua = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isIos && isSafari;
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

/**
 * دعوة تثبيت لمرّة واحدة على آيفون فقط — Safari لا يفعّل الإشعارات
 * الفورية إلا لموقع مضاف إلى الشاشة الرئيسية. تختفي نهائياً بعد
 * الإغلاق، وتلقائياً إن كانت المنصّة مثبَّتة أصلاً.
 */
export default function IosInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone()) return; // مثبَّتة أصلاً — لا داعي لأي دعوة
    if (!isIosSafari()) return;

    try {
      if (window.localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      /* تجاهل */
    }

    setShow(true);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* تجاهل */
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-fade-up px-4 pb-4 sm:pb-6">
      <div className="relative mx-auto max-w-md rounded-[26px] bg-card p-6 shadow-soft-lg">
        <button
          type="button"
          onClick={dismiss}
          aria-label={copy.dismiss}
          className="focus-ring tap-feedback absolute end-4 top-4 grid h-8 w-8 place-items-center rounded-full text-ink/30 hover:bg-cream hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>

        <h2 className="pe-8 font-heading text-base leading-[1.6] text-ink sm:text-lg">{copy.title}</h2>
        <p className="mt-2.5 text-sm leading-[1.95] text-ink-soft">{copy.body}</p>

        <ol className="mt-5 space-y-2.5">
          {copy.steps.map((step, i) => {
            const Icon = icons[step.icon] ?? Share;
            return (
              <li key={step.text} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink/12 font-heading text-xs text-pink-deep">
                  {i + 1}
                </span>
                <Icon className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-sm text-ink">{step.text}</span>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={dismiss}
          className="focus-ring tap-feedback mt-5 w-full rounded-2xl border border-ink/10 py-3 font-heading text-sm text-ink-soft transition-colors hover:border-ink/20 hover:text-ink"
        >
          {copy.dismiss}
        </button>
      </div>
    </div>
  );
}
