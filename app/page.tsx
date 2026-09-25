import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { TrustBar } from '@/components/landing/TrustBar';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { WhyFree } from '@/components/landing/WhyFree';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { BackToTop } from '@/components/shared/BackToTop';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Scroll Progress Bar at very top */}
      <ScrollProgress />

      {/* Glass Navbar */}
      <Navbar />

      {/* Main Content Sections: flows directly from How It Works to Why Free */}
      <main className="flex-1 w-full">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <WhyFree />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}
