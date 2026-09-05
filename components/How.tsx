import { how, cta, contact } from '@/content/site';
import { SectionHeading, CtaButton, WhatsAppLink } from './Ui';

const accents: Record<string, string> = {
  pink: 'bg-pink',
  blue: 'bg-blue',
  yellow: 'bg-yellow',
  green: 'bg-green',
};

export default function How() {
  return (
    <section id="how" className="scroll-mt-24 bg-blue/[0.07] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading title={how.title} intro={how.intro} />
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {how.items.map((item) => (
            <li
              key={item.title}
              className="rounded-3xl bg-card p-7 shadow-soft-sm transition-shadow duration-300 hover:shadow-soft sm:p-8"
            >
              <span
                className={`block h-1.5 w-10 rounded-full ${accents[item.accent] ?? 'bg-pink'}`}
                aria-hidden="true"
              />
              <h3 className="mt-5 font-heading text-lg leading-[1.6] text-ink sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-[2] text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-center gap-3 sm:mt-16 sm:flex-row sm:justify-center sm:gap-5">
          <CtaButton href="#form">{cta.primary}</CtaButton>
          <WhatsAppLink href={contact.whatsapp} label={cta.whatsapp} />
        </div>
      </div>
    </section>
  );
}
