'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fomo } from '@/content/site';
import { openLeadSheetOnMobile } from '@/lib/leadSheet';

/**
 * شريط الإلحاح — يظهر بعد تمرير 40% من الصفحة، ويختفي عند الوصول
 * إلى الاستمارة (لا داعي لإلحاح والزائر واقف على الحقول أصلاً).
 *
 * ⚠️ لا عدّاد تنازلي مزيّف. الرقم حقيقي ومصدره متغيّر واحد في
 * content/site.ts — يُحدَّث يدوياً حين تتغيّر الأماكن.
 *
 * الأداء: مستمع scroll سلبيّ مع requestAnimationFrame (قياس واحد
 * لكل إطار)، ومراقب تقاطع للاستمارة. لا قياس داخل حلقة التمرير.
 */
export default function FomoBar() {
  const [visible, setVisible] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setVisible(progress > 0.4);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });

    // يختفي تماماً عند ظهور قسم الاستمارة
    let io: IntersectionObserver | undefined;
    const formEl = document.getElementById('form');
    if (formEl && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => setAtForm(e.isIntersecting)),
        { threshold: 0.06 },
      );
      io.observe(formEl);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);

  const show = visible && !atForm;

  // يُعلن الحالة على <html> ليُزيح الشريط العلوي نفسه بـCSS بلا تمرير خصائص
  useEffect(() => {
    document.documentElement.dataset.fomo = show ? 'on' : 'off';
    return () => {
      document.documentElement.dataset.fomo = 'off';
    };
  }, [show]);

  return (
    <div
      className="fomo-bar pointer-events-none fixed inset-x-0 top-0 z-[60]"
      data-visible={show ? 'true' : 'false'}
      aria-hidden={!show}
    >
      <div className="bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
          <p className="flex min-w-0 items-center gap-2.5 text-xs text-white/90 sm:text-sm">
            <span className="hidden sm:inline">{fomo.prefix}</span>
            <span className="hidden h-1 w-1 shrink-0 rounded-full bg-white/40 sm:inline-block" aria-hidden="true" />
            <span className="truncate font-heading text-white">
              {fomo.seatsLabel(fomo.seatsLeft)}
            </span>
          </p>

          <Link
            href="#form"
            tabIndex={show ? 0 : -1}
            onClick={(e) => {
              if (openLeadSheetOnMobile()) e.preventDefault();
            }}
            className={`focus-ring tap-feedback shrink-0 rounded-full bg-pink px-4 py-1.5 font-heading text-xs text-white transition-colors hover:bg-pink-deep sm:px-5 sm:py-2 sm:text-sm ${
              show ? 'pointer-events-auto' : ''
            }`}
          >
            {fomo.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
