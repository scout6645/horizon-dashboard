import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ScreenshotsSection } from '@/components/landing/ScreenshotsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FreelanceSection } from '@/components/landing/FreelanceSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

const Landing: React.FC = () => (
  <div className="min-h-screen bg-background">
    <LandingNavbar />
    <main>
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <PricingSection />
      <FreelanceSection />
      <CTASection />
    </main>
    <LandingFooter />
  </div>
);

export default Landing;
