"use client";

import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from "@shared/ui";
import { NAV_LINKS } from "../model/nav-links";
import { cn } from "@shared/lib/utils";

export function NavbarMobileMenu({
  open,
  onOpenChange,
  pathname,
  isActiveRoute,
  searchSlot,
  authSlot,
}: Readonly<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pathname: string;
  isActiveRoute: (pathname: string, href: string) => boolean;
  searchSlot: React.ReactNode;
  authSlot: React.ReactNode;
}>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> PTIT Forum
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          <div className="pb-2">{searchSlot}</div>

          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((l) => {
              const active = isActiveRoute(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t">{authSlot}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
