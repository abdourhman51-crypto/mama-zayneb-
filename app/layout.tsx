import type { Metadata, Viewport } from 'next';
import { Readex_Pro, Almarai, Poppins } from 'next/font/google';
import './globals.css';

const readex = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-readex',
});

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-almarai',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'روضة ماما زينب — تاسوست، جيجل',
  description:
    'روضة ماما زينب في تاسوست: من 6 أشهر إلى 5 سنوات، من 8:00 إلى 16:30، مع نقل في كامل المدينة. اترك رقمك ونتصل بك.',
  metadataBase: new URL('https://mama-zayneb.vercel.app'),
  openGraph: {
    title: 'روضة ماما زينب — تاسوست، جيجل',
    description:
      'من 6 أشهر إلى 5 سنوات · من 8:00 إلى 16:30 · نقل في كامل تاسوست. اترك رقمك ونتصل بك.',
    locale: 'ar_DZ',
    type: 'website',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#FBF8F5',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${readex.variable} ${almarai.variable} ${poppins.variable}`}>
      <body className="font-body bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
