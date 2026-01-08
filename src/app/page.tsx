import { LandingHero } from '@features/landing/ui/landing-hero';
import { Footer } from '@widgets/footer/footer';
import { CTASection } from '@widgets/landing/ui/cta-section/cta-section';
import { FeaturesSection } from '@widgets/landing/ui/feature-section';
import { Navbar } from '@widgets/navbar/navbar';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingHero />

        {/* <Suspense fallback={<DocumentSectionSkeleton />}>
          <ServerDocumentSection title="Trending Documents" sort="viewCount,desc" />
        </Suspense>

        <Suspense fallback={<DocumentSectionSkeleton />}>
          <ServerDocumentSection title="Recent Uploads" sort="createdAt,desc" />
        </Suspense> */}

        <FeaturesSection />
        {/* <TrendingSection /> */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
