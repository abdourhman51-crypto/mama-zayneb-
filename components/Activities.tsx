import Image from 'next/image';
import { activities } from '@/content/site';
import { SectionHeading } from './Ui';
import SectionCta from './SectionCta';
import Reveal from './Reveal';

/**
 * الأنشطة — أسلوب تحريري لا كتالوجي.
 * لا بطاقات ولا إطارات ولا ظلال قاسية: صور كبيرة تتنفّس بأحجام
 * غير متساوية عمداً، والنصّ تحت الصورة دائماً — لا فوقها إطلاقاً.
 */
export default function Activities() {
  return (
    <section id="activities" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionHeading title={activities.title} intro={activities.intro} />
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:mt-20 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-6">
          {activities.items.map((item, i) => {
            const wide = item.span === 'wide';
            return (
              <Reveal
                as="li"
                key={item.src}
                delay={(i % 2) * 100}
                className={wide ? 'lg:col-span-3' : 'lg:col-span-2'}
              >
                <div
                  className={`relative overflow-hidden rounded-[28px] ${
                    wide ? 'aspect-[4/3] sm:aspect-[16/11]' : 'aspect-[4/5] sm:aspect-[4/5]'
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    loading="lazy"
                    className={`object-cover ${'pos' in item ? (item as { pos: string }).pos : 'object-center'}`}
                  />
                </div>

                <h3 className="mt-6 font-heading text-xl leading-[1.55] text-ink sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-md text-[0.95rem] leading-[2.05] text-ink-soft sm:text-base">
                  {item.body}
                </p>
              </Reveal>
            );
          })}
        </ul>

        <Reveal>
          <SectionCta note={activities.ctaNote} />
        </Reveal>
      </div>
    </section>
  );
}
