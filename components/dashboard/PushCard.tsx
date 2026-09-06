'use client';

import { useEffect, useState } from 'react';
import { BellRing, Check, Loader2, X } from 'lucide-react';
import { enablePush, readPushState, type PushState } from '@/lib/push/client';
import { push as copy } from '@/content/dashboard';

const DISMISS_KEY = 'mz.push.dismissed';

export default function PushCard() {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setState(readPushState());
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  async function onEnable() {
    setBusy(true);
    setError(null);
    try {
      const message = await enablePush();
      if (message) setError(message);
    } catch {
      setError(copy.failed);
    }
    setState(readPushState());
    setBusy(false);
  }

  function onDismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* تجاهل */
    }
  }

  if (state === null) return null;

  // مفعّلة — شريط تأكيد هادئ
  if (state === 'granted') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-green/15 px-5 py-3.5">
        <Check className="h-4 w-4 shrink-0 text-ink" strokeWidth={2.2} aria-hidden="true" />
        <p className="min-w-0 text-xs leading-[1.8] text-ink sm:text-sm">
          <span className="font-heading">{copy.enabled}.</span>{' '}
          <span className="text-ink-soft">{copy.enabledBody}</span>
        </p>
      </div>
    );
  }

  if (dismissed && state === 'default') return null;

  const blocked = state === 'denied' || state === 'unsupported';
  const title = state === 'denied' ? copy.denied : state === 'unsupported' ? copy.unsupported : copy.title;
  const help = state === 'denied' ? copy.deniedBody : copy.unsupportedBody;

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-card p-6 shadow-soft sm:p-8">
      <span
        className="absolute inset-y-0 start-0 w-1.5 bg-pink"
        aria-hidden="true"
      />

      {state === 'default' ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={copy.dismissed}
          className="focus-ring absolute end-4 top-4 grid h-8 w-8 place-items-center rounded-full text-ink/30 transition-colors hover:bg-cream hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>
      ) : null}

      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink/12 text-pink">
        <BellRing className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.75} aria-hidden="true" />
      </span>

      <h2 className="mt-5 font-heading text-lg leading-[1.6] text-ink sm:text-xl">{title}</h2>

      {blocked ? (
        <p className="mt-3 max-w-lg text-sm leading-[2] text-ink-soft">{help}</p>
      ) : (
        <>
          <p className="mt-3 max-w-lg text-sm leading-[2.05] text-ink-soft sm:text-base">{copy.body}</p>
          <p className="mt-4 max-w-lg border-s-2 border-pink/40 ps-4 font-heading text-sm leading-[1.95] text-ink sm:text-base">
            {copy.emphasis}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-[2] text-ink-soft">{copy.promise}</p>

          {error ? (
            <p role="alert" className="mt-4 rounded-2xl bg-pink/10 px-4 py-3 text-xs text-pink-deep">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onEnable}
              disabled={busy}
              className="focus-ring flex items-center justify-center gap-2.5 rounded-2xl bg-pink px-7 py-3.5 font-heading text-sm text-white shadow-soft-sm transition-colors hover:bg-pink-deep disabled:opacity-65 sm:text-base"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
                  {copy.enabling}
                </>
              ) : (
                <>
                  <BellRing className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {copy.enable}
                </>
              )}
            </button>
            <p className="text-xs leading-[1.8] text-ink-soft">{copy.privacy}</p>
          </div>
        </>
      )}
    </section>
  );
}
