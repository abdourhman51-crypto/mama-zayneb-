import { gallery } from '@/content/site';
import { SectionHeading } from './Ui';
import SectionCta from './SectionCta';
import Reveal from './Reveal';

const dotColors = ['bg-pink', 'bg-blue', 'bg-yellow', 'bg-green'];

/**
 * المرافق والرحلات — قسم نصّي عمداً.
 *
 * لماذا بلا صور: كل صور الروضة المتاحة مستعمَلة أصلاً في قسم
 * «الأنشطة» فوقه مباشرة. تكرارها هنا يجعل الصفحة تبدو مكرّرة
 * ومحشوّة. حين تصل صور رحلات جديدة، تُضاف هنا بشبكة تحريرية
 * بأحجام غير متساوية.
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

        <Reveal>
          <SectionCta note={gallery.ctaNote} />
        </Reveal>
      </div>
    </section>
  );
}
