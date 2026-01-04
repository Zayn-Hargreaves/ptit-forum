"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell } from "lucide-react";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@shared/ui";
import { useAuth } from "@shared/providers/auth-provider"; // Chỉ dùng để check logic Notification

import { NAV_LINKS, isActiveRoute } from "./model/nav-links";
import { NavbarLogo } from "./ui/logo";
import { NavbarNavLinks } from "./ui/nav-links";
import { NavbarSearchForm } from "./ui/search-form";
import { NavbarAuthActions } from "./ui/auth-actions";
import { NavbarMobileMenu } from "./ui/mobile.menu";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [open, setOpen] = useState(false);

  const onSubmitQuery = (q: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavbarLogo />

        <NavbarNavLinks
          links={NAV_LINKS}
          pathname={pathname}
          isActiveRoute={isActiveRoute}
        />

        <div className="flex items-center gap-2">
          <NavbarSearchForm
            pathname={pathname}
            onSubmitQuery={onSubmitQuery}
            className="hidden lg:flex flex-1 px-8"
          />

          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative shrink-0"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Thông báo (Coming Soon)
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <NavbarAuthActions />

          <NavbarMobileMenu
            open={open}
            onOpenChange={setOpen}
            pathname={pathname}
            isActiveRoute={isActiveRoute}
            searchSlot={
              <NavbarSearchForm
                pathname={pathname}
                onSubmitQuery={onSubmitQuery}
                className="block lg:hidden"
              />
            }
            authSlot={
              <NavbarAuthActions
                isMobile
                onCloseMobileMenu={() => setOpen(false)}
              />
            }
          />
        </div>
      </div>
    </nav>
  );
}
