import { Footer } from "@widgets/footer/footer";
import { CTASection } from "@widgets/landing/ui/cta-section";
import { FeaturesSection } from "@widgets/landing/ui/feature-section";
import { HeroSection } from "@widgets/landing/ui/hero-section";
import { Navbar } from "@widgets/navbar/navbar";
import { TrendingSection } from "@widgets/trending-section/trending-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TrendingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
