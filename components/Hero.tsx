import Image from 'next/image';
import { hero, cta, contact } from '@/content/site';
import { CtaButton, Dots } from './Ui';

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* الصورة تملأ الشاشة وتتلاشى تدريجياً حتى تذوب في الخلفية الكريمية */}
      <div className="hero-fade absolute inset-0 -z-20">
        <Image
          src="/images/hero-drawing.webp"
          alt="طفلة في روضة ماما زينب ترسم بأقلام ملوّنة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_18%] sm:object-[50%_22%]"
        />
      </div>

      {/* حجاب خفيف يحمي وضوح الشريط العلوي فوق الصورة */}
      <div className="hero-veil pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2" aria-hidden="true" />

      <div className="mx-auto w-full max-w-content px-5 pb-14 pt-40 sm:px-8 sm:pb-20 sm:pt-48">
        <div className="max-w-2xl animate-fade-up">
          <Dots className="mb-6" />
          <h1 className="font-heading text-[2rem] leading-[1.35] text-ink sm:text-5xl sm:leading-[1.28]">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-[2.05] text-ink-soft sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <CtaButton href="#form" className="w-full sm:w-auto">
              {cta.primary}
            </CtaButton>
            <span className="text-sm text-ink-soft sm:text-base">{hero.note}</span>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            {hero.facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-white/60 bg-white/75 px-5 py-4 shadow-soft-sm backdrop-blur-sm"
              >
                <dt className="font-body text-xs text-ink-soft">{fact.label}</dt>
                <dd className="mt-1 font-heading text-base text-ink sm:text-lg">{fact.value}</dd>
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
