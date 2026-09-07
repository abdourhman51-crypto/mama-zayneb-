'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * كشف هادئ عند التمرير — بديل خفيف تماماً لمكتبات الحركة.
 *
 * لماذا مبنيّ يدوياً بدل سحب مكوّن جاهز: كل مكوّنات الكشف الجاهزة
 * تعتمد Motion (‏+40KB جافاسكربت). الجمهور يأتي من إعلان ممول على 4G
 * في هاتف، والقاعدة المتّفق عليها: إن تعارضت الحركة مع السرعة، السرعة
 * تفوز. هذا الملفّ أقلّ من 1KB ويحقّق النتيجة نفسها.
 *
 * القيود المطبَّقة:
 * - transform و opacity فقط — لا خاصية تُسبّب إعادة تخطيط (layout).
 * - IntersectionObserver لا مستمعات scroll.
 * - prefers-reduced-motion: إيقاف كامل، المحتوى يظهر فوراً.
 * - الهاتف: مسافة الحركة نصف مسافة الحاسوب.
 * - بلا جافاسكربت: المحتوى مرئي كاملاً (الإخفاء يبدأ من JS فقط).
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  /** تأخير تتابعي بالميلي ثانية — للعناصر داخل قائمة */
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'figure';
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  // يبدأ ظاهراً: لو تعطّل جافاسكربت أو تأخّر، لا يختفي المحتوى أبداً
  const [shown, setShown] = useState(true);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    // نُخفيه الآن فقط — بعد التأكّد أن الحركة مسموحة والمراقب متاح
    setArmed(true);
    setShown(false);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${armed ? 'reveal-armed' : ''} ${shown ? 'reveal-in' : ''} ${className}`}
      style={armed && !shown ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
