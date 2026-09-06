'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { brand, modules, statusLabels } from '@/content/dashboard';

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <rect x="4" y="8.5" width="12" height="8" rx="2.5" />
      <path d="M7 8.5V6.5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1.5">
      {modules.map((m) => {
        const active = pathname === m.href;
        const locked = m.status !== 'live';
        return (
          <Link
            key={m.slug}
            href={m.href}
            onClick={() => setOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={`focus-ring group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 font-heading text-sm transition-colors duration-200 ${
              active
                ? 'bg-pink text-white shadow-soft-sm'
                : 'text-ink hover:bg-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              {locked ? (
                <LockIcon className={`h-4 w-4 ${active ? 'text-white/80' : 'text-ink/35'}`} />
              ) : (
                <span className={`h-2 w-2 rounded-full ${active ? 'bg-white' : 'bg-green'}`} aria-hidden="true" />
              )}
              {m.label}
            </span>
            {locked ? (
              <span
                className={`rounded-full px-2.5 py-1 text-[0.68rem] ${
                  active ? 'bg-white/20 text-white' : 'bg-ink/5 text-ink-soft'
                }`}
              >
                {m.phase}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* شريط الهاتف */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/8 bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="focus-ring rounded-xl">
          <Image src="/images/logo.png" alt="" width={428} height={431} className="h-9 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="focus-ring rounded-2xl border border-ink/12 bg-white px-4 py-2 font-heading text-sm text-ink"
        >
          {open ? 'إغلاق' : 'القائمة'}
        </button>
      </div>

      {open ? (
        <div className="border-b border-ink/8 bg-cream px-4 py-4 lg:hidden">
          {nav}
          <button
            type="button"
            onClick={signOut}
            className="focus-ring mt-4 w-full rounded-2xl border border-ink/12 px-4 py-3 font-heading text-sm text-ink-soft"
          >
            تسجيل الخروج
          </button>
        </div>
      ) : null}

      {/* الشريط الجانبي على الشاشات الكبيرة */}
      <aside className="sticky top-0 hidden h-[100svh] w-72 shrink-0 flex-col border-l border-ink/8 bg-cream px-5 py-7 lg:flex">
        <Link href="/dashboard" className="focus-ring flex items-center gap-3 rounded-xl px-2">
          <Image src="/images/logo.png" alt="" width={428} height={431} className="h-11 w-auto" />
          <span className="flex flex-col">
            <span className="font-heading text-sm text-ink">{brand.platform}</span>
            <span className="text-xs text-ink-soft">{brand.subtitle}</span>
          </span>
        </Link>

        <div className="mt-9 flex-1">{nav}</div>

        <div className="border-t border-ink/8 pt-5">
          <p className="truncate px-2 text-xs text-ink-soft" dir="ltr">
            {email}
          </p>
          <button
            type="button"
            onClick={signOut}
            className="focus-ring mt-3 w-full rounded-2xl border border-ink/12 px-4 py-3 font-heading text-sm text-ink-soft transition-colors hover:border-ink/25 hover:text-ink"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
