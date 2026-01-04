"use client";

import { Button } from "@shared/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function GuestContent() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-3xl font-bold md:text-4xl text-balance">
        Sẵn sàng tham gia cộng đồng?
      </h2>
      <p className="mb-8 text-lg text-muted-foreground">
        Đăng ký ngay để kết nối với hàng nghìn sinh viên PTIT, chia sẻ kiến thức
        và cùng nhau phát triển.
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
  );
}
