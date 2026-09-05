import Image from 'next/image';
import { gallery } from '@/content/site';
import { SectionHeading } from './Ui';

export default function Gallery() {
  const [first, ...rest] = gallery.items;

  return (
    <section id="gallery" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading title={gallery.title} intro={gallery.intro} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-5 lg:gap-6">
          <figure className="group relative overflow-hidden rounded-[28px] shadow-soft lg:col-span-3">
            <div className="relative aspect-[4/3] lg:aspect-[16/11]">
              <Image
                src={first.src}
                alt={first.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                loading="lazy"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="absolute bottom-4 right-4 rounded-2xl bg-white/90 px-4 py-2 font-heading text-sm text-ink backdrop-blur-sm">
              {first.caption}
            </figcaption>
          </figure>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1 lg:gap-6">
            {rest.map((item) => (
              <figure key={item.src} className="group relative overflow-hidden rounded-[28px] shadow-soft">
                <div className="relative aspect-[4/3] lg:aspect-[16/11]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="absolute bottom-4 right-4 rounded-2xl bg-white/90 px-4 py-2 font-heading text-sm text-ink backdrop-blur-sm">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
