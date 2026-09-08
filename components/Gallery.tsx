import Image from 'next/image';
import { gallery } from '@/content/site';
import { SectionHeading } from './Ui';
import SectionCta from './SectionCta';
import Reveal from './Reveal';

const dotColors = ['bg-pink', 'bg-blue', 'bg-yellow', 'bg-green'];

/**
 * المرافق والرحلات.
 *
 * الأعلى: قائمة نصّية سريعة القراءة (لا صور مكرّرة مع قسم الأنشطة).
 * الأسفل: صورة مكتب الاستقبال — أوّل ما يراه الولي حين يدخل، وهي
 * الصورة الوحيدة هنا لأنّها تُظهر مكاناً لا نشاطاً.
 */
export default function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-blue/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionHeading title={gallery.title} intro={gallery.intro} />
        </Reveal>

        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-4 sm:mt-16 sm:gap-x-6 sm:gap-y-5">
          {gallery.items.map((item, i) => (
            <Reveal
              as="li"
              key={item}
              delay={i * 70}
              className="flex items-center gap-3 rounded-full bg-card px-6 py-3.5 shadow-soft-sm sm:px-7 sm:py-4"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${dotColors[i % dotColors.length]}`}
                aria-hidden="true"
              />
              <span className="font-heading text-sm text-ink sm:text-base">{item}</span>
            </Reveal>
          ))}
        </ul>

        {/* مكتب الاستقبال — أوّل ما يراه الولي حين يدخل.
            عرض تحريري: صورة بنسبتها الطبيعية إلى جانب النصّ، بلا إطار
            ولا بطاقة، والنصّ أبداً فوق الصورة. */}
        <Reveal className="mt-16 block sm:mt-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-14">
            <div className="lg:w-5/12">
              <Image
                src={gallery.reception.src}
                alt={gallery.reception.alt}
                width={gallery.reception.w}
                height={gallery.reception.h}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="h-auto w-full rounded-[28px] object-cover"
              />
            </div>
            <div className="lg:w-7/12">
              <h3 className="font-heading text-xl leading-[1.5] text-ink sm:text-3xl sm:leading-[1.45]">
                {gallery.reception.title}
              </h3>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-[2.05] text-ink-soft sm:mt-4 sm:text-lg sm:leading-[2]">
                {gallery.reception.body}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <SectionCta note={gallery.ctaNote} />
        </Reveal>
      </div>
    </section>
  );
}
