'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { nav } from '@/content/site';

export default function Header() {
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      // 0 → 1 عبر أول 220 بكسل، حتى يكتسب الشريط خلفيته تدريجياً
      setScrolled(Math.min(window.scrollY / 220, 1));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[backdrop-filter] duration-300"
      style={{
        backgroundColor: `rgba(251, 248, 245, ${(solid * 0.88).toFixed(3)})`,
        backdropFilter: solid > 0.04 ? `saturate(140%) blur(${(solid * 14).toFixed(1)}px)` : 'none',
        WebkitBackdropFilter:
          solid > 0.04 ? `saturate(140%) blur(${(solid * 14).toFixed(1)}px)` : 'none',
        boxShadow: solid > 0.5 ? `0 10px 40px -28px rgba(74,59,114,${(solid * 0.5).toFixed(2)})` : 'none',
      }}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
        <Link href="#top" className="focus-ring rounded-xl" aria-label="روضة ماما زينب — الصفحة الرئيسية">
          <Image
            src="/images/logo.png"
            alt="روضة ماما زينب"
            width={428}
            height={431}
            priority
            className="h-11 w-auto sm:h-14"
          />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-1 md:flex">
            {[
              { href: '#how', label: nav.how },
              { href: '#gallery', label: nav.gallery },
              { href: '#faq', label: nav.faq },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-xl px-4 py-2 font-heading text-sm text-ink transition-colors duration-300 hover:text-pink"
                style={{ textShadow: solid < 0.35 ? '0 1px 12px rgba(255,255,255,0.85)' : 'none' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="#form"
            className="focus-ring rounded-2xl bg-pink px-5 py-2.5 font-heading text-sm text-white shadow-soft-sm transition-all duration-300 hover:bg-pink-deep sm:px-6 sm:py-3 sm:text-base"
          >
            {nav.cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}
