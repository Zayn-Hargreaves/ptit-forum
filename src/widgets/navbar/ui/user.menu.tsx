"use client";

import Link from "next/link";
import { LogOut, User as UserIcon, Settings } from "lucide-react"; 
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui";
import { UserAvatar } from "@shared/ui/user-avatar/user-avatar";
import { User } from "@entities/session/model/types";

interface NavbarUserMenuProps {
  user: User;
  onLogout: () => void;
  isMobile?: boolean;
}

export function NavbarUserMenu({
  user,
  onLogout,
}: Readonly<NavbarUserMenuProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative h-9 w-9 overflow-hidden"
        >
          <UserAvatar
            name={user.fullName || user.email}
            avatarUrl={user.avatar}
            className="h-9 w-9"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" forceMount>
        {/* Header hiển thị tên & email */}
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium leading-none truncate">{user.fullName}</p>
            <p className="w-[200px] truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}`} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Trang cá nhân
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Cài đặt tài khoản
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
