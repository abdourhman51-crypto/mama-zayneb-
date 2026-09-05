import { contact, cta } from '@/content/site';
import { WhatsAppIcon } from './Ui';

export default function FloatingWhatsApp() {
  return (
    <a
      href={contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={cta.whatsapp}
      className="focus-ring fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-green text-white shadow-soft-lg transition-transform duration-300 hover:scale-105 active:scale-95 md:hidden"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
