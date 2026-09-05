import { pain } from '@/content/site';
import { Dots } from './Ui';
import SectionCta from './SectionCta';

export default function Pain() {
  return (
    <section className="mx-auto max-w-content px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Dots />
          <h2 className="font-heading text-[1.75rem] leading-[1.4] text-ink sm:text-4xl sm:leading-[1.3]">
            {pain.title}
          </h2>
        </div>

        <ul className="mt-10 space-y-4 sm:mt-12">
          {pain.items.map((item) => (
            <li
              key={item}
              className="flex gap-4 rounded-3xl bg-white/70 px-6 py-5 text-base leading-[2] text-ink-soft shadow-soft-sm sm:px-7 sm:text-lg"
            >
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-pink/60" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center font-heading text-lg leading-[1.9] text-ink sm:text-2xl sm:leading-[1.8]">
          {pain.emphasis}
        </p>

        <SectionCta note={pain.ctaNote} />
      </div>
    </section>
  );
}
