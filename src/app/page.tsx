import { Suspense } from "react";
import { HeroSection } from "@widgets/landing/ui/hero-section";
import { FeaturesSection } from "@widgets/landing/ui/feature-section";
import { CTASection } from "@widgets/landing/ui/cta-section/cta-section";
import { TrendingSection } from "@widgets/trending-section/trending-section";

import { Navbar } from "@widgets/navbar/navbar";
import { Footer } from "@widgets/footer/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <FeaturesSection />

        <Suspense fallback={<TrendingSectionSkeleton />}>
          <TrendingSection />
        </Suspense>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

function TrendingSectionSkeleton() {
  return (
    <div className="py-20 container mx-auto">
      <div className="h-8 w-48 bg-muted animate-pulse mb-8 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
