'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { login } from '@/content/dashboard';

const field =
  'focus-ring w-full rounded-2xl border border-ink/12 bg-white px-5 py-4 font-body text-base text-ink shadow-soft-sm transition-colors duration-200 placeholder:text-ink/35 hover:border-ink/20';

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDetail(null);
    setStatus('loading');

    const fd = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(fd.get('email') ?? '').trim(),
      password: String(fd.get('password') ?? ''),
    });

    if (authError) {
      const wrongCredentials = /invalid login credentials/i.test(authError.message);
      setError(wrongCredentials ? login.error : login.generic);
      // نعرض الرسالة الأصلية عند أي خطأ آخر حتى يمكن تشخيصه بلا تخمين
      if (!wrongCredentials) setDetail(authError.message);
      setStatus('idle');
      return;
    }

    // الوجهة تُقرأ من العنوان مباشرة — بلا useSearchParams حتى تُعرَض
    // الاستمارة من الخادم دون انتظار جافاسكربت.
    const next = new URLSearchParams(window.location.search).get('next');
    router.replace(next && next.startsWith('/dashboard') ? next : '/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-5 text-center">
          <Image
            src="/images/logo.png"
            alt="روضة ماما زينب"
            width={428}
            height={431}
            priority
            className="h-16 w-auto"
          />
          <h1 className="font-heading text-2xl text-ink">{login.title}</h1>
          <p className="text-sm text-ink-soft">{login.subtitle}</p>
        </div>

        <div className="mt-9 rounded-[32px] bg-card p-7 shadow-soft sm:p-9">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block font-heading text-sm text-ink">
                {login.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                dir="ltr"
                autoComplete="email"
                className={`${field} text-start`}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block font-heading text-sm text-ink">
                {login.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                dir="ltr"
                autoComplete="current-password"
                className={`${field} text-start`}
              />
            </div>

            {error ? (
              <div role="alert" className="rounded-2xl bg-pink/10 px-5 py-4 text-sm text-pink-deep">
                <p>{error}</p>
                {detail ? (
                  <p className="mt-2 text-xs leading-[1.8] opacity-80" dir="ltr">
                    {login.detail} {detail}
                  </p>
                ) : null}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="focus-ring w-full rounded-2xl bg-pink px-8 py-4 font-heading text-lg text-white shadow-soft transition-all duration-300 hover:bg-pink-deep disabled:opacity-65"
            >
              {status === 'loading' ? login.submitting : login.submit}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
