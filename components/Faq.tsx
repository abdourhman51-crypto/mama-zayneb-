'use client';

import { useState } from 'react';
import { faq } from '@/content/site';
import { SectionHeading } from './Ui';
import Reveal from './Reveal';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-yellow/[0.10] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionHeading title={faq.title} intro={faq.intro} />
        </Reveal>

        <ul className="mx-auto mt-14 max-w-2xl space-y-3 sm:mt-16 sm:space-y-4">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="overflow-hidden rounded-3xl bg-card shadow-soft-sm">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="focus-ring flex w-full items-center justify-between gap-4 rounded-3xl px-6 py-5 text-start font-heading text-base leading-[1.7] text-ink transition-colors duration-300 hover:text-pink sm:px-8 sm:py-6 sm:text-lg"
                  >
                    <span>{item.q}</span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink/10 text-pink transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M10 4v12M4 10h12" />
                      </svg>
                    </span>
                  </button>
                </h3>
                {/* أكورديون متحرّك: 0fr → 1fr يمنح ارتفاعاً متحرّكاً
                    دون قياس بجافاسكربت. النصّ يبقى في الـDOM دائماً. */}
                <div id={`faq-panel-${i}`} className="acc-panel" data-open={isOpen} role="region" aria-hidden={!isOpen}>
                  <div className="acc-inner">
                    <p className="px-6 pb-6 text-[0.95rem] leading-[2.05] text-ink-soft sm:px-8 sm:pb-8 sm:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
