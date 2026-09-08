import Image from 'next/image';
import { activities } from '@/content/site';
import { SectionHeading } from './Ui';
import SectionCta from './SectionCta';
import Reveal from './Reveal';

/**
 * الأنشطة — عرض تحريري، الهاتف أولاً.
 *
 * القواعد المطبَّقة:
 * - لا بطاقات ولا إطارات ولا ظلال قاسية.
 * - كل صورة بنسبتها الطبيعية (width/height الحقيقيان) فلا تُقصّ
 *   قسرياً ولا تظهر الوجوه مقطوعة بشكل غريب.
 * - على الهاتف: صورة كاملة العرض تتنفّس، ثم النصّ تحتها.
 * - على الحاسوب: تناوب يمين/يسار بعرض غير متساوٍ (7/5) — إيقاع
 *   تحريري لا شبكة متماثلة.
 * - النصّ أبداً فوق الصورة.
 */
export default function Activities() {
  return (
    <section id="activities" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionHeading title={activities.title} intro={activities.intro} />
        </Reveal>
      </div>

      <ul className="mt-14 space-y-16 sm:mt-20 sm:space-y-24">
        {activities.items.map((item, i) => {
          const flipped = i % 2 === 1;
          return (
            <Reveal as="li" key={item.src}>
              <div className="mx-auto max-w-content px-5 sm:px-8">
                <div
                  className={`flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-14 ${
                    flipped ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="lg:w-7/12">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.w}
                      height={item.h}
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="h-auto w-full rounded-[28px] object-cover"
                    />
                  </div>

                  <div className="lg:w-5/12">
                    <h3 className="font-heading text-xl leading-[1.5] text-ink sm:text-3xl sm:leading-[1.45]">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[0.95rem] leading-[2.05] text-ink-soft sm:mt-4 sm:text-lg sm:leading-[2]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>

      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <SectionCta note={activities.ctaNote} />
        </Reveal>
      </div>
    </section>
  );
}
