import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Pain from '@/components/Pain';
import Change from '@/components/Change';
import Activities from '@/components/Activities';
import Trust from '@/components/Trust';
import Faq from '@/components/Faq';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PixelLoader from '@/components/PixelLoader';

export default function Page() {
  return (
    <>
      <PixelLoader />
      <Header />
      <main>
        <Hero />
        <Pain />
        <Change />
        <Activities />
        <Trust />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
