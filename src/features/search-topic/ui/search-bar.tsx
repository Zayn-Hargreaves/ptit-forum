'use client';

import { Input } from '@shared/ui/input/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

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
    <div className="relative mx-auto w-full max-w-lg">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="Tìm kiếm chủ đề thảo luận..."
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-background/95 border-primary/20 focus-visible:ring-primary/30 pl-9 backdrop-blur-sm"
      />
    </div>
  );
};
