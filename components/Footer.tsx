import Image from 'next/image';
import { contact, footer } from '@/content/site';
import { Dots, WhatsAppIcon } from './Ui';

export default function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex flex-col items-center gap-8 text-center">
          <Image
            src="/images/logo.png"
            alt="روضة ماما زينب"
            width={428}
            height={431}
            loading="lazy"
            className="h-20 w-auto sm:h-24"
          />
          <p className="font-heading text-base text-ink sm:text-lg">{footer.tagline}</p>
          <Dots />


          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <a href={contact.phoneTel} dir="ltr" className="focus-ring rounded-xl font-heading text-base text-ink transition-colors hover:text-pink">
              {contact.phoneDisplay}
            </a>
            <a href={`mailto:${contact.email}`} dir="ltr" className="focus-ring rounded-xl font-latin text-sm text-ink-soft transition-colors hover:text-pink">
              {contact.email}
            </a>
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-xl text-base text-ink transition-colors hover:text-pink">
              <WhatsAppIcon className="h-5 w-5" />
              واتساب
            </a>
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="focus-ring rounded-xl text-base text-ink transition-colors hover:text-pink">
              فيسبوك
            </a>
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring rounded-xl text-base text-ink transition-colors hover:text-pink">
              إنستغرام
            </a>
          </div>

          <p className="pt-4 text-sm text-ink-soft">
            © {new Date().getFullYear()} روضة ماما زينب — {footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
