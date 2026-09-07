import { trust } from '@/content/site';
import { SectionHeading } from './Ui';
import SectionCta from './SectionCta';
import Reveal from './Reveal';

export default function Trust() {
  return (
    <section id="trust" className="scroll-mt-24 bg-green/[0.10] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionHeading title={trust.title} intro={trust.intro} />
        </Reveal>

        <ol className="mx-auto mt-14 max-w-3xl space-y-4 sm:mt-16 sm:space-y-5">
          {trust.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(i % 2) * 90}
              className="flex gap-5 rounded-3xl bg-card px-6 py-6 shadow-soft-sm sm:gap-6 sm:px-9 sm:py-8"
            >
              <span
                className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green/20 font-heading text-sm text-ink"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-heading text-lg leading-[1.6] text-ink sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-[2.05] text-ink-soft sm:text-base">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal><SectionCta note={trust.ctaNote} /></Reveal>
      </div>
    </section>
  );
}
