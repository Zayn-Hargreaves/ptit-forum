import { Suspense } from "react";
import { LandingHero } from "@features/landing/ui/landing-hero";
import { ServerDocumentSection } from "@features/landing/ui/server-doc-section";
import { Skeleton } from "@shared/ui/skeleton/skeleton";
import { Navbar } from "@widgets/navbar/navbar";
import { Footer } from "@widgets/footer/footer";
import { FeaturesSection } from "@widgets/landing/ui/feature-section";
import { TrendingSection } from "@widgets/trending-section/trending-section";
import { CTASection } from "@widgets/landing/ui/cta-section/cta-section";

function DocumentSectionSkeleton() {
  return (
    <div className="container py-12 px-4 md:px-6">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingHero />

        <Suspense fallback={<DocumentSectionSkeleton />}>
          <ServerDocumentSection title="Trending Documents" sort="viewCount,desc" />
        </Suspense>

        <Suspense fallback={<DocumentSectionSkeleton />}>
          <ServerDocumentSection title="Recent Uploads" sort="createdAt,desc" />
        </Suspense>

        <FeaturesSection />
        <TrendingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
