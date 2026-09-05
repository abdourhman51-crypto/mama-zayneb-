import { cta, contact } from '@/content/site';
import { CtaButton, WhatsAppLink } from './Ui';

/** زوج CTA يتكرّر تحت كل قسم — الأساسي للاستمارة، والثانوي لواتساب. */
export default function SectionCta({ note }: { note?: string }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-4 sm:mt-14">
      <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        <CtaButton href="#form" className="w-full sm:w-auto">
          {cta.primary}
        </CtaButton>
        <WhatsAppLink href={contact.whatsapp} label={cta.whatsapp} className="justify-center" />
      </div>
      {note ? <p className="text-center text-sm text-ink-soft">{note}</p> : null}
    </div>
  );
}
