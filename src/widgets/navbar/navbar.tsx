'use client';

import { useAuth } from '@shared/providers/auth-provider';
import { Upload } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/shared/ui';
import { NotificationBell } from '@/widgets/header/ui/notification-bell';

import { isActiveRoute, NAV_LINKS } from './model/nav-links';
import { NavbarAuthActions } from './ui/auth-actions';
import { NavbarLogo } from './ui/logo';
import { NavbarMobileMenu } from './ui/mobile.menu';
import { NavbarNavLinks } from './ui/nav-links';
import { NavbarSearchForm } from './ui/search-form';

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
    <nav className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavbarLogo />

        <NavbarNavLinks links={NAV_LINKS} pathname={pathname} isActiveRoute={isActiveRoute} />

        <div className="flex items-center gap-2">
          <NavbarSearchForm
            pathname={pathname}
            onSubmitQuery={onSubmitQuery}
            className="hidden flex-1 px-8 lg:flex"
          />

          {!isLoading && user && (
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push('/documents/upload')}
              className="mr-2 hidden gap-2 lg:flex"
            >
              <Upload className="h-4 w-4" />
              <span>Đăng tài liệu</span>
            </Button>
          )}

          {!isLoading && user && <NotificationBell />}

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
            authSlot={<NavbarAuthActions isMobile onCloseMobileMenu={() => setOpen(false)} />}
          />
        </div>
      </div>
    </nav>
  );
}
