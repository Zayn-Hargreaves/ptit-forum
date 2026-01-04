import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@shared/ui/button/button";
import { getLandingStats } from "@entities/landing/api/get-landing-stats";

async function HeroStats() {
  try {
    const stats = await getLandingStats();

    return (
      <div className="mt-20 grid grid-cols-2 gap-8 border-t border-primary/10 pt-10 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-bold text-foreground md:text-4xl">
              {s.value}
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch landing stats:", error);
    return null;
  }
}

function StatsSkeleton() {
  return (
    <div className="mt-20 grid grid-cols-2 gap-8 border-t border-primary/10 pt-10 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-10 w-20 rounded-md bg-muted/50 animate-pulse" />
          <div className="h-4 w-24 rounded-md bg-muted/30 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

const HERO_CONTENT = {
  badge: "Cộng đồng sinh viên PTIT",
  title: "Nơi kết nối và chia sẻ: tri thức",
  description:
    "Tham gia cộng đồng sinh viên Học viện Công nghệ Bưu chính Viễn thông. Thảo luận, chia sẻ tài liệu, và cùng nhau phát triển.",
  primaryAction: { label: "Bắt đầu ngay", href: "/register" },
  secondaryAction: { label: "Khám phá thư viện", href: "/documents" },
};

function renderTitle(title: string) {
  const parts = title.split(":");
  return (
    <>
      <span className="block">{parts[0]?.trim()}:</span>
      {parts[1] && (
        <span className="block text-primary italic">
          {parts.slice(1).join(":").trim()}
        </span>
      )}
    </>
  );
}

export function HeroSection() {
  // Lưu ý: Không còn 'async' ở đây nữa -> Render tức thì
  return (
    <section
      className="relative overflow-hidden border-b py-20 md:py-32"
      aria-labelledby="hero-heading"
    >
      {/* Background Image - LCP Element */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/team-collaboration.png"
          alt="Sinh viên PTIT hoạt động nhóm"
          fill
          priority // Rất quan trọng cho LCP
          quality={90}
          sizes="100vw"
          className="object-cover opacity-30 dark:opacity-20 blur-[2px]" // Giảm opacity để text dễ đọc hơn
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {HERO_CONTENT.badge}
            </span>
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="text-balance text-5xl font-extrabold tracking-tight md:text-7xl"
          >
            {renderTitle(HERO_CONTENT.title)}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            {HERO_CONTENT.description}
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto px-10 shadow-xl shadow-primary/20 font-bold"
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
              className="w-full sm:w-auto bg-background/60 backdrop-blur-sm"
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
