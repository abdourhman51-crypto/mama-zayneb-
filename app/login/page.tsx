'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { phoneToLoginIdentity } from '@/lib/staffAuth';
import { login } from '@/content/dashboard';

const field =
  'focus-ring w-full rounded-2xl border border-ink/12 bg-white py-4 pl-5 pr-12 text-left font-body text-base text-ink shadow-soft-sm transition-colors duration-200 placeholder:text-ink/30 hover:border-ink/20';

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDetail(null);

    const fd = new FormData(event.currentTarget);
    const identity = phoneToLoginIdentity(String(fd.get('phone') ?? ''));

    if (!identity) {
      setError(login.phoneInvalid);
      return;
    }

    setStatus('loading');

    const { error: authError } = await createClient().auth.signInWithPassword({
      email: identity,
      password: String(fd.get('password') ?? ''),
    });

    if (authError) {
      const wrongCredentials = /invalid login credentials/i.test(authError.message);
      setError(wrongCredentials ? login.error : login.generic);
      if (!wrongCredentials) setDetail(authError.message);
      setStatus('idle');
      return;
    }

    const next = new URLSearchParams(window.location.search).get('next');
    router.replace(next && next.startsWith('/dashboard') ? next : '/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/logo.png"
            alt="روضة ماما زينب"
            width={428}
            height={431}
            priority
            className="h-16 w-auto"
          />
          <h1 className="font-heading text-xl text-ink sm:text-2xl">{login.title}</h1>
          <p className="text-sm text-ink-soft">{login.subtitle}</p>
        </div>

        <div className="mt-8 rounded-[28px] bg-card p-6 shadow-soft sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="phone" className="mb-2 block font-heading text-sm text-ink">
                {login.phone}
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  dir="ltr"
                  autoComplete="tel"
                  placeholder={login.phonePlaceholder}
                  className={field}
                />
                <Phone
                  className="pointer-events-none absolute inset-y-0 right-4 my-auto h-[1.15rem] w-[1.15rem] text-ink/30"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block font-heading text-sm text-ink">
                {login.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  dir="ltr"
                  autoComplete="current-password"
                  className={field}
                />
                <Lock
                  className="pointer-events-none absolute inset-y-0 right-4 my-auto h-[1.15rem] w-[1.15rem] text-ink/30"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
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
              className="focus-ring flex w-full items-center justify-center gap-2.5 rounded-2xl bg-pink px-8 py-4 font-heading text-base text-white shadow-soft transition-all duration-300 hover:bg-pink-deep disabled:opacity-65"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-[1.15rem] w-[1.15rem] animate-spin" strokeWidth={2} aria-hidden="true" />
                  {login.submitting}
                </>
              ) : (
                login.submit
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
