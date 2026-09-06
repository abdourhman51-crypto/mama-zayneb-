'use client';

import { useEffect, useState } from 'react';
import { BellRing, Loader2, X } from 'lucide-react';
import { enablePush, hasActiveSubscription, readPushState, type PushState } from '@/lib/push/client';
import { push as copy } from '@/content/dashboard';

const DISMISS_KEY = 'mz.push.dismissed';

type ViewState = 'checking' | 'subscribed' | 'promptable' | 'blocked' | 'dismissed' | 'hidden';

export default function PushCard() {
  const [view, setView] = useState<ViewState>('checking');
  const [permission, setPermission] = useState<PushState>('default');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const state = readPushState();
      if (cancelled) return;
      setPermission(state);

      if (state === 'unsupported') return setView('hidden');
      if (state === 'denied') return setView('blocked');

      if (state === 'granted') {
        // مهمّ: «ممنوح» في المتصفّح لا يعني أن الاشتراك محفوظ فعلاً —
        // قد يكون قد فشل حفظه سابقاً على هذا الجهاز تحديداً.
        const active = await hasActiveSubscription();
        if (cancelled) return;
        return setView(active ? 'subscribed' : 'promptable');
      }

      let dismissed = false;
      try {
        dismissed = window.localStorage.getItem(DISMISS_KEY) === '1';
      } catch {
        dismissed = false;
      }
      setView(dismissed ? 'dismissed' : 'promptable');
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onEnable() {
    setBusy(true);
    setError(null);
    const message = await enablePush();
    if (message) {
      setError(message);
      setPermission(readPushState());
      setBusy(false);
      return;
    }
    setView('subscribed');
    setBusy(false);
  }

  function onDismiss() {
    setView('dismissed');
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* تجاهل */
    }
  }

  // مفعّلة فعلاً، أو مرفوضة سابقاً، أو غير مدعومة، أو لا نعرف بعد —
  // لا داعي لبطاقة مزعجة في كل هذه الحالات.
  if (view === 'checking' || view === 'subscribed' || view === 'dismissed' || view === 'hidden') {
    return null;
  }

  const blocked = view === 'blocked';

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-card p-6 shadow-soft sm:p-8">
      <span className="absolute inset-y-0 start-0 w-1.5 bg-pink" aria-hidden="true" />

      {!blocked ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={copy.dismissed}
          className="focus-ring tap-feedback absolute end-4 top-4 grid h-8 w-8 place-items-center rounded-full text-ink/30 transition-colors hover:bg-cream hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>
      ) : null}

      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink/12 text-pink">
        <BellRing className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.75} aria-hidden="true" />
      </span>

      <h2 className="mt-5 font-heading text-lg leading-[1.6] text-ink sm:text-xl">
        {blocked ? copy.denied : copy.title}
      </h2>

      {blocked ? (
        <p className="mt-3 max-w-lg text-sm leading-[2] text-ink-soft">{copy.deniedBody}</p>
      ) : (
        <>
          <p className="mt-3 max-w-lg text-sm leading-[2.05] text-ink-soft sm:text-base">{copy.body}</p>
          <p className="mt-4 max-w-lg border-s-2 border-pink/40 ps-4 font-heading text-sm leading-[1.95] text-ink sm:text-base">
            {copy.emphasis}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-[2] text-ink-soft">{copy.promise}</p>

          {error ? (
            <p role="alert" className="mt-4 rounded-2xl bg-pink/10 px-4 py-3 text-xs leading-[1.8] text-pink-deep">
              {error}
              {permission === 'denied' ? ` ${copy.deniedBody}` : ''}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onEnable}
              disabled={busy}
              className="focus-ring tap-feedback flex items-center justify-center gap-2.5 rounded-2xl bg-pink px-7 py-3.5 font-heading text-sm text-white shadow-soft-sm transition-colors hover:bg-pink-deep disabled:opacity-65 sm:text-base"
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
