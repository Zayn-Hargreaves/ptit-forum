import { Button } from "@shared/ui/button/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-muted-foreground">
              Cộng đồng sinh viên PTIT
            </span>
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Nơi kết nối và chia sẻ{" "}
            <span className="text-primary">tri thức</span>
          </h1>

          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Tham gia cộng đồng sinh viên Học viện Công nghệ Bưu chính Viễn
            thông. Thảo luận, chia sẻ tài liệu, và cùng nhau phát triển.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/register">
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto bg-transparent"
            >
              <Link href="/forum">Khám phá diễn đàn</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-8">
            <div>
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <div className="text-sm text-muted-foreground">Sinh viên</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">Bài viết</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">800+</div>
              <div className="text-sm text-muted-foreground">Tài liệu</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-0 -z-10 h-full w-full">
        {/* Background image with opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{
            backgroundImage: "url('/team-collaboration.png')",
          }}
        ></div>

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background/80"></div>

        {/* Decorative Elements */}
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl"></div>
      </div>
    </section>
  );
}
