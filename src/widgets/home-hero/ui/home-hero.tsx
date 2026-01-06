'use client';

import { SearchBar } from '@features/search-topic/ui/search-bar';

export function HomeHero() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
      <div className="w-full">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Diễn đàn</h1>
        <p className="text-muted-foreground mb-6">Chào mừng đến với cộng đồng thảo luận PTIT</p>

        <div className="w-full">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
