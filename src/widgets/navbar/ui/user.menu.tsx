'use client';

import { User } from '@entities/session/model/types';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface NavbarUserMenuProps {
  user: User;
  onLogout: () => void;
  isMobile?: boolean;
}

export function NavbarUserMenu({ user, onLogout }: Readonly<NavbarUserMenuProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 overflow-hidden rounded-full"
        >
          <UserAvatar
            name={user.fullName || user.email}
            avatarUrl={user.avatarUrl}
            className="h-9 w-9"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" forceMount>
        {/* Header hiển thị tên & email */}
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="truncate leading-none font-medium">{user.fullName}</p>
            <p className="text-muted-foreground w-[200px] truncate text-xs">{user.email}</p>
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

        {user.role === 'ADMIN' && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/admin/documents"
                className="cursor-pointer font-semibold text-yellow-600 focus:text-yellow-700"
              >
                <span className="mr-2">⚡</span>
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={onLogout}
          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
