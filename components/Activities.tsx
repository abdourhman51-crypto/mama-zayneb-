import Image from 'next/image';
import { activities } from '@/content/site';
import { SectionHeading } from './Ui';
import SectionCta from './SectionCta';

export default function Activities() {
  return (
    <section id="activities" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading title={activities.title} intro={activities.intro} />
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {activities.items.map((item) => (
            <li
              key={item.src}
              className={`group overflow-hidden rounded-[28px] bg-card shadow-soft-sm transition-shadow duration-300 hover:shadow-soft ${
                item.span === 'wide' ? 'lg:col-span-3' : 'lg:col-span-2'
              }`}
            >
              <div
                className={`relative ${
                  item.span === 'wide' ? 'aspect-[4/3] lg:aspect-[16/10]' : 'aspect-[4/3] lg:aspect-[4/3]'
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  loading="lazy"
                  className={`object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] ${
                    'pos' in item ? (item as { pos: string }).pos : 'object-center'
                  }`}
                />
              </div>
              <div className="px-6 py-6 sm:px-7 sm:py-7">
                <h3 className="font-heading text-lg leading-[1.6] text-ink sm:text-xl">{item.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-[2] text-ink-soft">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <SectionCta note={activities.ctaNote} />
      </div>
    </section>
  );
}
