import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Worry from '@/components/Worry';
import How from '@/components/How';
import Gallery from '@/components/Gallery';
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
        <Worry />
        <How />
        <Gallery />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
