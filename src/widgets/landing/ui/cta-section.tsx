import { Button } from "@shared/ui/button/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-t bg-linear-to-br from-primary/5 via-background to-accent/5 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Sẵn sàng tham gia cộng đồng?
          </h2>
          <p className="mb-8 text-pretty text-lg text-muted-foreground">
            Đăng ký ngay để kết nối với hàng nghìn sinh viên PTIT, chia sẻ kiến
            thức và cùng nhau phát triển.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Đăng ký miễn phí
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Đã có tài khoản? Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
