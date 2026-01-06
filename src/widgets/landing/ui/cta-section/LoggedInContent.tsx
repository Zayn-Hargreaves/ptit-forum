'use client';

import { Button } from '@shared/ui';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function LoggedInContent({ username }: { username: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">
        Sẵn sàng chia sẻ kiến thức hôm nay?
      </h2>
      <p className="text-muted-foreground mb-8 text-lg">
        Chào mừng trở lại, <span className="text-foreground font-bold">{username || 'bạn'}</span>!
        Hãy bắt đầu một thảo luận mới hoặc chia sẻ tài liệu cho bạn bè nhé.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/forum/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Đăng bài mới
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/forum">Vào diễn đàn</Link>
        </Button>
      </div>
    </div>
  );
}
