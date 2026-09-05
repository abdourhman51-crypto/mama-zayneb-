import Image from 'next/image';
import { hero, cta, contact } from '@/content/site';
import { CtaButton, Dots } from './Ui';

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* الصورة تملأ الشاشة وتتلاشى تدريجياً حتى تذوب في الخلفية الكريمية */}
      <div className="hero-fade absolute inset-x-0 top-0 -z-20 h-[76svh] sm:h-[100svh]">
        <Image
          src="/images/hero-drawing.webp"
          alt="طفلة في روضة ماما زينب ترسم بأقلام ملوّنة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_12%] sm:object-[50%_23%]"
        />
      </div>

      {/* ستار كريمي متدرّج: يضمن أن يقع النصّ على خلفية كريمية صافية */}
      <div className="hero-scrim pointer-events-none absolute inset-x-0 top-0 -z-10 h-[76svh] sm:h-[100svh]" aria-hidden="true" />

      {/* مساحة تُظهر الصورة قبل أن يبدأ النصّ */}
      <div className="min-h-[64svh] flex-1 sm:min-h-[96svh]" aria-hidden="true" />

      <div className="mx-auto w-full max-w-content px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="max-w-2xl animate-fade-up">
          <Dots className="mb-6" />
          <h1 className="font-heading text-[1.9rem] leading-[1.4] text-ink sm:text-5xl sm:leading-[1.28]">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-[2.05] text-ink-soft sm:mt-6 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
            <CtaButton href="#form" className="w-full sm:w-auto">
              {cta.primary}
            </CtaButton>
            <span className="text-sm text-ink-soft sm:text-base">{hero.note}</span>
          </div>

          <dl className="mt-9 grid grid-cols-1 gap-3 sm:mt-11 sm:grid-cols-3 sm:gap-4">
            {hero.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft-sm sm:block"
              >
                <dt className="font-body text-xs text-ink-soft">{fact.label}</dt>
                <dd className="font-heading text-base text-ink sm:mt-1 sm:text-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm text-ink-soft">
            {contact.city} · {contact.hours}
          </p>
        </div>
      </div>
    </section>
  );
}
