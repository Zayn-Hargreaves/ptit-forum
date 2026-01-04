"use client";

import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
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
import { User } from "@entities/session/model/types";
import { useMemo } from "react";

interface NavbarUserMenuProps {
  user: User;
  onLogout: () => void;
  isMobile?: boolean;
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export function NavbarUserMenu({ user, onLogout }: NavbarUserMenuProps) {
  const displayName = user.fullName || user.email || "User";

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [displayName]);

  const bgColor = useMemo(() => stringToColor(displayName), [displayName]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative h-9 w-9"
        >
          <Avatar className="h-9 w-9 border transition-opacity hover:opacity-80">
            {user.avatarUrl && (
              <AvatarImage
                src={user.avatarUrl}
                alt={displayName}
                className="object-cover"
              />
            )}

            <AvatarFallback
              className="text-white text-xs font-bold"
              style={{ backgroundColor: user.avatarUrl ? undefined : bgColor }}
            >
              {initials}
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
