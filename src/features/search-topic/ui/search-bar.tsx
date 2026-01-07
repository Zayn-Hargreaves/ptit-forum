'use client';

import { Input } from '@shared/ui/input/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    
    replace(`/forum?${params.toString()}`, { scroll: false });
  }, 500);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm chủ đề thảo luận..."
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 bg-background/95 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30"
      />
    </div>
  );
};
