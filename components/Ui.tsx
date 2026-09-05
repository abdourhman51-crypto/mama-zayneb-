import Link from 'next/link';

export function Dots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      <span className="h-2 w-2 rounded-full bg-pink" />
      <span className="h-2 w-2 rounded-full bg-blue" />
      <span className="h-2 w-2 rounded-full bg-yellow" />
      <span className="h-2 w-2 rounded-full bg-green" />
    </div>
  );
}

export function SectionHeading({
  title,
  intro,
  align = 'center',
}: {
  title: string;
  intro?: string;
  align?: 'center' | 'start';
}) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-start';
  return (
    <div className={`flex flex-col gap-5 ${alignCls}`}>
      <Dots />
      <h2 className="font-heading text-[1.75rem] leading-[1.35] text-ink sm:text-4xl sm:leading-[1.3]">
        {title}
      </h2>
      {intro ? (
        <p className="max-w-xl text-base leading-[2] text-ink-soft sm:text-lg">{intro}</p>
      ) : null}
    </div>
  );
}

export function CtaButton({
  href = '#form',
  children,
  variant = 'primary',
  className = '',
}: {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
}) {
  const base =
    'focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-8 py-4 font-heading text-base transition-all duration-300 sm:text-lg';
  const styles =
    variant === 'primary'
      ? 'bg-pink text-white shadow-soft hover:bg-pink-deep hover:shadow-soft-lg active:scale-[0.985]'
      : 'border border-ink/15 bg-white/85 text-ink shadow-soft-sm hover:border-ink/25 hover:bg-white';
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function WhatsAppLink({
  href,
  label,
  className = '',
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`focus-ring inline-flex items-center gap-2 whitespace-nowrap rounded-2xl px-6 py-3.5 font-heading text-base text-ink transition-colors duration-300 hover:text-pink ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
