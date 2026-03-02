import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProofStrip } from "@/components/landing/SocialProofStrip";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AICapabilities } from "@/components/landing/AICapabilities";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQSection } from "@/components/landing/FAQSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden">
      <LandingNavbar />
      <HeroSection />
      <SocialProofStrip />
      <FeaturesGrid />
      <HowItWorks />
      <AICapabilities />
      <Testimonials />
      <FAQSection />
      <LandingFooter />
    </div>
  );
}
