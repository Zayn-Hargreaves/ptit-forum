"use client";

import Link from "next/link";
import { Bell, Search, Menu, GraduationCap } from "lucide-react";
import { Input } from "@shared/ui/input/input";
import { Button } from "@shared/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Badge } from "@shared/ui/badge/badge";

export function Navbar() {
  // Mock authentication state
  const isAuthenticated = true;
  const notificationCount = 3;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-lg font-semibold md:inline-block">
            PTIT Forum
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Trang chủ
          </Link>
          <Link
            href="/announcements"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Thông báo
          </Link>
          <Link
            href="/forum"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Diễn đàn
          </Link>
          <Link
            href="/documents"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Tài liệu
          </Link>
          <Link
            href="/gpa"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Tính GPA
          </Link>
          <Link
            href="/events"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Sự kiện
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài viết, tài liệu..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2">
                    <h3 className="font-semibold">Thông báo</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/notifications">Xem tất cả</Link>
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3"
                    >
                      <p className="text-sm font-medium">
                        Có người trả lời bài viết của bạn
                      </p>
                      <p className="text-xs text-muted-foreground">
                        5 phút trước
                      </p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3"
                    >
                      <p className="text-sm font-medium">
                        Tài liệu mới được thêm vào môn học
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 giờ trước
                      </p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3"
                    >
                      <p className="text-sm font-medium">Sự kiện sắp diễn ra</p>
                      <p className="text-xs text-muted-foreground">
                        2 giờ trước
                      </p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/notifications"
                      className="w-full text-center text-sm font-medium text-primary"
                    >
                      Xem tất cả thông báo
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Hồ sơ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history">Lịch sử</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
