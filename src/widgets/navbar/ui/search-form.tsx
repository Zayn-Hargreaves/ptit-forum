'use client';

import { Input } from '@shared/ui';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function NavbarSearchForm({
  pathname,
  onSubmitQuery,
  className,
}: {
  pathname: string;
  onSubmitQuery: (q: string) => void;
  className?: string;
}) {
  const [value, setValue] = useState('');
  const lastSubmitted = useRef('');

  useEffect(() => {
    setValue('');
  }, [pathname]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;

    if (
      (pathname === '/search' ||
        pathname.startsWith('/search?') ||
        pathname.startsWith('/search/')) &&
      lastSubmitted.current === q
    )
      return;

    lastSubmitted.current = q;
    onSubmitQuery(q);
    setValue('');
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative w-full max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          name="q"
          type="search"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder="Tìm kiếm bài viết, tài liệu..."
          className="pl-9"
          aria-label="Tìm kiếm"
        />
      </div>
    </form>
  );
}
