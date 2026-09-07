import { socialProof } from '@/content/site';
import { Dots } from './Ui';
import Reveal from './Reveal';

/**
 * الشهادات — عرض هادئ باقتباس كبير.
 * بلا صور رمزية، بلا نجوم تقييم، بلا أسماء مخترعة. الاقتباس وحده.
 */
export default function SocialProof() {
  return (
    <section id="social-proof" className="scroll-mt-24 bg-pink/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <Dots />
          <h2 className="font-heading text-[1.75rem] leading-[1.4] text-ink sm:text-4xl sm:leading-[1.3]">
            {socialProof.title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl space-y-12 sm:mt-20 sm:space-y-16">
          {socialProof.items.map((item, i) => (
            <Reveal as="figure" key={item.quote} delay={i * 110}>
              <blockquote>
                <p className="border-s-[3px] border-pink/45 ps-6 font-heading text-xl leading-[1.85] text-ink sm:ps-9 sm:text-3xl sm:leading-[1.75]">
                  {item.quote}
                </p>
              </blockquote>
              <figcaption className="mt-4 ps-6 text-sm text-ink-soft sm:ps-9 sm:text-base">
                {item.attribution}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
