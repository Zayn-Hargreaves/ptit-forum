'use client';

import { SearchBar } from '@features/search-topic/ui/search-bar';

export function HomeHero() {
  return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div className="w-full">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Diễn đàn</h1>
              <p className="text-muted-foreground mb-6">Chào mừng đến với cộng đồng thảo luận PTIT</p>
              
              <div className="w-full">
                 <SearchBar />
              </div>
          </div>
      </div>
  );
}
