'use client';

import { useEffect, useRef, useState } from 'react';
import { socialProof } from '@/content/site';
import { Dots } from './Ui';
import Reveal from './Reveal';

/**
 * الشهادات — كاروسيل بالسحب، الهاتف أولاً.
 *
 * السحب أصليّ (scroll-snap) لا بمكتبة إيماءات: أخفّ وأسلس على
 * الهاتف، ويعمل بالكيبورد وبعجلة اللمس تلقائياً. النقاط تعكس
 * الموضع الحالي وتنقل إليه.
 *
 * بلا صور رمزية، بلا نجوم تقييم، بلا أسماء مخترعة.
 */
export default function SocialProof() {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [active, setActive] = useState(0);

  // الموضع الحالي عبر مراقب تقاطع داخل المسار — لا مستمع تمرير
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      { root: track, threshold: 0.6 },
    );
    Array.from(track.children).forEach((child) => io.observe(child));
    return () => io.disconnect();
  }, []);

  function goTo(i: number) {
    const track = trackRef.current;
    const item = track?.children[i] as HTMLElement | undefined;
    if (!track || !item) return;
    track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }

  return (
    <section id="social-proof" className="scroll-mt-24 overflow-hidden bg-pink/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <Dots />
          <h2 className="font-heading text-[1.75rem] leading-[1.4] text-ink sm:text-4xl sm:leading-[1.3]">
            {socialProof.title}
          </h2>
        </Reveal>
      </div>

      <Reveal>
        <ul
          ref={trackRef}
          className="snap-track mt-12 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mt-16 sm:gap-8 sm:px-8"
          tabIndex={0}
          aria-label={socialProof.title}
        >
          {socialProof.items.map((item, i) => (
            <li
              key={item.quote}
              data-index={i}
              className="snap-item w-[86%] shrink-0 sm:w-[70%] lg:w-[52%]"
            >
              <figure className="h-full rounded-[28px] bg-card/70 p-7 shadow-soft-sm sm:p-10">
                <blockquote>
                  <p className="border-s-[3px] border-pink/45 ps-5 font-heading text-lg leading-[1.9] text-ink sm:ps-8 sm:text-2xl sm:leading-[1.8]">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-5 ps-5 text-sm text-ink-soft sm:ps-8 sm:text-base">
                  {item.attribution}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-7 flex justify-center gap-2.5">
        {socialProof.items.map((item, i) => (
          <button
            key={item.quote}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${i + 1} / ${socialProof.items.length}`}
            aria-current={active === i}
            className={`focus-ring h-2 rounded-full transition-all duration-300 ${
              active === i ? 'w-7 bg-pink' : 'w-2 bg-ink/20'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
