'use client';

import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/shared/providers/auth-provider';
import { Button } from '@/shared/ui';

export function LandingHero() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/documents?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-40 md:pt-32 md:pb-56 lg:pt-48 lg:pb-72">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/team-collaboration.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="max-w-4xl space-y-4">
            <h1 className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              Kho Tàng Tri Thức Học Thuật
            </h1>
            <p className="mx-auto max-w-[800px] text-gray-200 md:text-xl">
              Truy cập hàng ngàn tài liệu học tập, đề thi và bài giảng được chia sẻ bởi sinh viên.
              Tham gia cộng đồng để cùng nhau học tập và phát triển.
            </p>
          </div>

          <div className="w-full max-w-lg space-y-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm môn học, tài liệu..."
                  className="border-input bg-background/95 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-9 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Tìm kiếm</Button>
            </form>

            {!user && (
              <div className="flex justify-center space-x-4 pt-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  <Link href="/register">
                    Bắt đầu ngay <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
