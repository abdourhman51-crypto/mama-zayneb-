import { guarantees } from '@/content/site';
import { SectionHeading } from './Ui';
import SectionCta from './SectionCta';
import Reveal from './Reveal';

/**
 * الضمانات — أسلوب تحريري بلا بطاقات ولا إطارات.
 * كل التزام سطر أفقي يفصله خطّ شعري، ورقمه بلون من الهوية.
 */
const accents = ['bg-pink', 'bg-blue', 'bg-yellow', 'bg-green'];

export default function Guarantees() {
  return (
    <section id="guarantees" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionHeading title={guarantees.title} intro={guarantees.intro} />
        </Reveal>

        <ul className="mx-auto mt-14 max-w-3xl sm:mt-16">
          {guarantees.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 90}
              className="flex gap-5 border-b border-ink/10 py-7 last:border-0 sm:gap-7 sm:py-9"
            >
              <span
                className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${accents[i % accents.length]}`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <h3 className="font-heading text-lg leading-[1.6] text-ink sm:text-2xl sm:leading-[1.5]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-[2.05] text-ink-soft sm:text-lg sm:leading-[2]">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <SectionCta note={guarantees.ctaNote} />
        </Reveal>
      </div>
    </section>
  );
}
