import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@shared/ui";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/team-collaboration.png"
          alt="PTIT Students Collaboration"
          fill
          priority
          className="object-cover object-center opacity-50 dark:opacity-10"
          sizes="100vw"
        />
        {/* Overlay gradient để text dễ đọc hơn */}
        <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/50 to-background/90" />
      </div>

      {/* Decorative Elements (Blur Blobs) - Giữ nguyên nhưng giảm z-index để không che text */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
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
            <Button
              size="lg"
              asChild
              className="w-full min-w-[200px] sm:w-auto font-bold shadow-lg shadow-primary/20"
            >
              <Link href="/register">
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto bg-background/50 backdrop-blur-sm"
            >
              <Link href="/forum">Khám phá diễn đàn</Link>
            </Button>
          </div>

          {/* Quick Stats - Nên tách component nếu tái sử dụng */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-8 backdrop-blur-sm">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">
                5,000+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Sinh viên
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">
                1,200+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Bài viết
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">
                800+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Tài liệu
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
