import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Pain from '@/components/Pain';
import Change from '@/components/Change';
import Activities from '@/components/Activities';
import Trust from '@/components/Trust';
import Gallery from '@/components/Gallery';
import Guarantees from '@/components/Guarantees';
import SocialProof from '@/components/SocialProof';
import Faq from '@/components/Faq';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FomoBar from '@/components/FomoBar';
import PixelLoader from '@/components/PixelLoader';
import BottomSheet from '@/components/BottomSheet';

export default function Page() {
  return (
    <>
      <PixelLoader />
      <FomoBar />
      <Header />
      <main>
        <Hero />
        <Pain />
        <Change />
        <Activities />
        <Trust />
        <Gallery />
        <Guarantees />
        <SocialProof />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BottomSheet />
    </>
  );
}
