'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ChevronRight, LogOut, Lock, Menu, PanelLeftClose, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { brand, modules } from '@/content/dashboard';
import { ModuleIcon } from './icons';
import IosInstallPrompt from './IosInstallPrompt';

const STORAGE_KEY = 'mz.sidebar.collapsed';

export default function Shell({
  staffName,
  staffPhone,
  role,
  children,
}: {
  staffName: string;
  staffPhone: string;
  role: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  // تفضيل الطيّ يُحفَظ لكل جهاز
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      /* التخزين قد يكون معطّلاً */
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => {
      const next = !v;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* تجاهل */
      }
      return next;
    });
  }, []);

  // إغلاق الدرج عند تغيير الصفحة، ودعم زرّ Escape
  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawer]);

  const current = modules.find((m) => m.href === pathname) ?? modules[0];

  async function signOut() {
    await createClient().auth.signOut();
    router.replace('/login');
    router.refresh();
  }

  const navItems = (compact: boolean) => (
    <ul className="space-y-1.5">
      {modules.map((m) => {
        const active = pathname === m.href;
        const locked = m.status !== 'live';
        return (
          <li key={m.slug}>
            <Link
              href={m.href}
              title={compact ? m.label : undefined}
              aria-current={active ? 'page' : undefined}
              className={`focus-ring tap-feedback group relative flex items-center gap-3 rounded-2xl py-3 font-heading text-sm transition-all duration-200 ${
                compact ? 'justify-center px-0' : 'px-3.5'
              } ${
                active
                  ? 'bg-pink text-white shadow-soft-sm'
                  : 'text-ink/75 hover:bg-white hover:text-ink'
              }`}
            >
              <ModuleIcon
                name={m.icon}
                className={`h-[1.15rem] w-[1.15rem] shrink-0 ${active ? 'text-white' : 'text-ink/45 group-hover:text-pink'}`}
              />
              {!compact ? (
                <>
                  <span className="flex-1 truncate">{m.label}</span>
                  {locked ? (
                    <Lock
                      className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-white/70' : 'text-ink/25'}`}
                      strokeWidth={2}
                      aria-label="قيد التطوير"
                    />
                  ) : (
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-white' : 'bg-green'}`}
                      aria-hidden="true"
                    />
                  )}
                </>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const userCard = (compact: boolean) => (
    <div className={`border-t border-ink/8 pt-4 ${compact ? 'px-0' : 'px-1'}`}>
      {!compact ? (
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-soft-sm">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink/12 font-heading text-sm text-pink-deep">
            {staffName.trim().charAt(0) || 'م'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-heading text-sm text-ink">{staffName}</span>
            <span className="block truncate text-xs text-ink-soft" dir="ltr">
              {staffPhone}
            </span>
          </span>
        </div>
      ) : null}
      <button
        type="button"
        onClick={signOut}
        title="تسجيل الخروج"
        className={`focus-ring tap-feedback flex w-full items-center gap-3 rounded-2xl py-3 font-heading text-sm text-ink-soft transition-colors hover:bg-white hover:text-pink-deep ${
          compact ? 'justify-center px-0' : 'px-3.5'
        }`}
      >
        <LogOut className="h-[1.15rem] w-[1.15rem] shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {!compact ? <span>تسجيل الخروج</span> : null}
      </button>
    </div>
  );

  const logo = (compact: boolean) => (
    <Link href="/dashboard" className="focus-ring flex items-center gap-3 rounded-2xl">
      <Image
        src="/images/logo.png"
        alt=""
        width={428}
        height={431}
        priority
        className="h-10 w-auto shrink-0"
      />
      {!compact ? (
        <span className="min-w-0 flex-1">
          <span className="block truncate font-heading text-sm text-ink">{brand.platform}</span>
          <span className="block truncate text-xs text-ink-soft">{brand.subtitle}</span>
        </span>
      ) : null}
    </Link>
  );

  return (
    <div className="min-h-[100svh] bg-cream">
      {/* ── الشريط الجانبي — الشاشات الكبيرة ───────────────────── */}
      <aside
        className={`fixed inset-y-0 right-0 z-30 hidden flex-col border-l border-ink/8 bg-cream/95 px-4 py-6 backdrop-blur transition-[width] duration-300 ease-out lg:flex ${
          collapsed ? 'w-[5.5rem]' : 'w-[17rem]'
        }`}
      >
        <div className={collapsed ? 'flex justify-center' : ''}>{logo(collapsed)}</div>

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'توسيع القائمة' : 'طيّ القائمة'}
          aria-expanded={!collapsed}
          className="focus-ring tap-feedback mt-6 flex items-center justify-center gap-2 rounded-2xl border border-ink/10 py-2.5 text-ink-soft transition-colors hover:border-ink/20 hover:text-ink"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={2} aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="font-heading text-xs">طيّ القائمة</span>
            </>
          )}
        </button>

        <nav className="mt-6 flex-1 overflow-y-auto">{navItems(collapsed)}</nav>
        {userCard(collapsed)}
      </aside>

      {/* ── الدرج — الهاتف ────────────────────────────────────── */}
      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 right-0 flex w-[80%] max-w-xs animate-fade-up flex-col border-l border-ink/8 bg-cream px-4 py-6 shadow-soft-lg">
            <div className="flex items-center justify-between gap-3">
              {logo(false)}
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="إغلاق"
                className="focus-ring tap-feedback grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-ink-soft"
              >
                <X className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-7 flex-1 overflow-y-auto">{navItems(false)}</nav>
            {userCard(false)}
          </div>
        </div>
      ) : null}

      {/* ── المحتوى ───────────────────────────────────────────── */}
      <div
        className={`transition-[padding] duration-300 ease-out ${
          collapsed ? 'lg:pr-[5.5rem]' : 'lg:pr-[17rem]'
        }`}
      >
        <header className="sticky top-0 z-20 border-b border-ink/8 bg-cream/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-9 lg:py-5">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="فتح القائمة"
              className="focus-ring tap-feedback grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-ink/10 bg-white text-ink lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-heading text-base text-ink sm:text-lg">{current.label}</h1>
              <p className="hidden truncate text-xs text-ink-soft sm:block">{current.tagline}</p>
            </div>

            <span className="hidden shrink-0 rounded-full bg-white px-3.5 py-1.5 font-heading text-xs text-ink-soft shadow-soft-sm sm:inline">
              {role === 'owner' ? 'المالِكة' : 'مشرف'}
            </span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-9 lg:py-10">{children}</main>
      </div>

      <IosInstallPrompt />
    </div>
  );
}
