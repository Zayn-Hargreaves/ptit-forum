import { getLandingStats } from '@entities/landing/api/get-landing-stats';
import { Button } from '@shared/ui/button/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import heroImage from '../../../../public/team-collaboration.png';

async function HeroStats() {
  try {
    const stats = await getLandingStats();

    return (
      <div className="border-primary/10 animate-in fade-in slide-in-from-bottom-4 mt-20 grid grid-cols-2 gap-8 border-t pt-10 duration-700 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-foreground text-3xl font-bold md:text-4xl">{s.value}</div>
            <div className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch landing stats:', error);
    return null;
  }
}

function StatsSkeleton() {
  return (
    <div className="border-primary/10 mt-20 grid grid-cols-2 gap-8 border-t pt-10 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="bg-muted/50 h-10 w-20 animate-pulse rounded-md" />
          <div className="bg-muted/30 h-4 w-24 animate-pulse rounded-md" />
        </div>
      ))}
    </div>
  );
}

const HERO_CONTENT = {
  badge: 'Cộng đồng sinh viên PTIT',
  title: 'Nơi kết nối và chia sẻ: tri thức',
  description:
    'Tham gia cộng đồng sinh viên Học viện Công nghệ Bưu chính Viễn thông. Thảo luận, chia sẻ tài liệu, và cùng nhau phát triển.',
  primaryAction: { label: 'Bắt đầu ngay', href: '/register' },
  secondaryAction: { label: 'Khám phá thư viện', href: '/documents' },
};

function renderTitle(title: string) {
  const parts = title.split(':');
  return (
    <>
      <span className="block">{parts[0]?.trim()}:</span>
      {parts[1] && (
        <span className="text-primary block italic">{parts.slice(1).join(':').trim()}</span>
      )}
    </>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden border-b py-20 md:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt="Sinh viên PTIT hoạt động nhóm"
          fill
          priority
          placeholder="blur"
          quality={90}
          sizes="100vw"
          className="object-cover opacity-30 dark:opacity-20"
        />
        <div className="from-background via-background/80 to-background absolute inset-0 bg-linear-to-b" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="bg-primary/5 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span className="text-primary text-xs font-bold tracking-wider uppercase">
              {HERO_CONTENT.badge}
            </span>
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="text-5xl font-extrabold tracking-tight text-balance md:text-7xl"
          >
            {renderTitle(HERO_CONTENT.title)}
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-pretty md:text-xl">
            {HERO_CONTENT.description}
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="shadow-primary/20 w-full px-10 font-bold shadow-xl sm:w-auto"
            >
              <Link href={HERO_CONTENT.primaryAction.href}>
                {HERO_CONTENT.primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-background/60 w-full backdrop-blur-sm sm:w-auto"
            >
              <Link href={HERO_CONTENT.secondaryAction.href}>
                {HERO_CONTENT.secondaryAction.label}
              </Link>
            </Button>
          </div>

          <Suspense fallback={<StatsSkeleton />}>
            <HeroStats />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
