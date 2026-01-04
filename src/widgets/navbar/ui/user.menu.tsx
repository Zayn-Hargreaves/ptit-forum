"use client";

import Link from "next/link";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui";
import { UserAuthResponse } from "@shared/types/auth";
import { getAvatarUrl } from "@shared/lib/avatar";

interface NavbarUserMenuProps {
  user: UserAuthResponse;
  onLogout: () => void;
  isMobile?: boolean; // Nếu muốn custom style cho mobile
}

export function NavbarUserMenu({ user, onLogout }: NavbarUserMenuProps) {
  const displayName = user.fullName || user.email || "User";
  // Lấy 2 chữ cái đầu nếu có thể: "Nguyen Van A" -> "NA"
  const fallback = displayName.substring(0, 2).toUpperCase();

  const avatarUrl = getAvatarUrl({
    avatar: user.avatar,
    email: user.email,
    name: user.fullName,
    size: 64,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative h-9 w-9"
        >
          <Avatar className="h-9 w-9 border transition-opacity hover:opacity-80">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium leading-none">{user.fullName}</p>
            <p className="w-[200px] truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Logic phân quyền: Nếu là Admin thì hiện Dashboard */}
        {/* user.roles?.includes('ADMIN') && ... */}

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Hồ sơ cá nhân
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
