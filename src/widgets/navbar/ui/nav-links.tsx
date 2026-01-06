'use client';

import { cn } from '@shared/lib/utils';
import Link from 'next/link';

export function NavbarNavLinks({
  links,
  pathname,
  isActiveRoute,
}: {
  links: readonly { href: string; label: string }[];
  pathname: string;
  isActiveRoute: (pathname: string, href: string) => boolean;
}) {
  return (
    <div className="hidden items-center gap-6 md:flex">
      {links.map((link) => {
        const active = isActiveRoute(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'hover:text-primary text-sm font-medium transition-colors',
              active ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
