"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@shared/providers/auth-provider";
import { Button, Skeleton } from "@shared/ui";
import { cn } from "@shared/lib/utils";
import { NavbarUserMenu } from "./user.menu";

interface NavbarAuthActionsProps {
  isMobile?: boolean;
  onCloseMobileMenu?: () => void;
}

export function NavbarAuthActions({
  isMobile,
  onCloseMobileMenu,
}: NavbarAuthActionsProps) {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onCloseMobileMenu?.();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return isMobile ? (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    ) : (
      <div className="hidden sm:flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={cn(
          isMobile ? "flex flex-col gap-2" : "hidden sm:flex gap-2"
        )}
      >
        <Button variant="ghost" asChild className={cn(isMobile && "w-full")}>
          <Link href="/login" onClick={onCloseMobileMenu}>
            Đăng nhập
          </Link>
        </Button>
        <Button asChild className={cn(isMobile && "w-full")}>
          <Link href="/register" onClick={onCloseMobileMenu}>
            Đăng ký
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(isMobile ? "w-full" : "")}>
      <NavbarUserMenu user={user} onLogout={handleLogout} isMobile={isMobile} />
    </div>
  );
}
