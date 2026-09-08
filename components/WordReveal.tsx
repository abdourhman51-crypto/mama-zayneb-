'use client';

import { useEffect, useState } from 'react';

/**
 * كشف النصّ كلمةً كلمة — بديل الـTypewriter المناسب للعربية.
 *
 * ⚠️ لماذا كلمة لا حرفاً: العربية خطّ متّصل، وتقسيم النصّ إلى أحرف
 * داخل عناصر منفصلة يكسر التشكيل والوصلات فتظهر الحروف مفكّكة
 * (مثال: «مكان» تصير «م ك ا ن»). الكشف بالكلمة يحفظ الشكل تماماً.
 *
 * النصّ كامل في الـDOM دائماً — محرّكات البحث وقارئات الشاشة تراه
 * كاملاً، ولو تعطّل جافاسكربت يظهر فوراً بلا نقصان.
 */
export default function WordReveal({
  text,
  className = '',
  stagger = 55,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  /** المسافة الزمنية بين كل كلمة والتي تليها (ms) */
  stagger?: number;
  as?: 'span' | 'h1' | 'h2' | 'p';
}) {
  const [armed, setArmed] = useState(false);
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    const id = window.requestAnimationFrame(() => setGo(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={`word-reveal ${armed ? 'word-reveal-armed' : ''} ${go ? 'word-reveal-in' : ''}`}
          style={armed ? { transitionDelay: `${i * stagger}ms` } : undefined}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
