"use client";

import Link from "next/link";
import type { NAV_LINKS as _NAV } from "../model/nav-links";
import { cn } from "@shared/lib/utils";

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
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
