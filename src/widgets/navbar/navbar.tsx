"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, Search, Menu, GraduationCap, LogOut, User } from "lucide-react";

import {
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@shared/ui";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// 🧠 Senior Mindset: Tách cấu hình link ra khỏi UI để dễ bảo trì/thêm mới
const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/announcements", label: "Thông báo" },
  { href: "/forum", label: "Diễn đàn" },
  { href: "/documents", label: "Tài liệu" },
  { href: "/gpa", label: "Tính GPA" },
  { href: "/events", label: "Sự kiện" },
];

export function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // TODO: Thay bằng hook useAuth() thực tế sau này
  const isAuthenticated = true;
  const notificationCount = 3;

  // 🧠 Search Handler: Xử lý tìm kiếm cơ bản
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = e.currentTarget.value.trim();
      if (query) {
        setIsMobileMenuOpen(false); // Đóng menu nếu đang ở mobile
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-lg font-semibold md:inline-block">
            PTIT Forum
          </span>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* --- DESKTOP SEARCH --- */}
        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài viết, tài liệu... (Enter)"
              className="pl-9"
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Trigger (Optional: nếu muốn tách nút search riêng trên mobile) */}

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
                {/* ... (Giữ nguyên nội dung dropdown notification của em) ... */}
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Demo Notification
                  </div>
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
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" /> Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          )}

          {/* --- MOBILE MENU (SHEET) --- */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" /> PTIT Forum
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                {/* Search Mobile */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    className="pl-9"
                    onKeyDown={handleSearch}
                  />
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col space-y-3">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium transition-colors hover:text-primary py-2 border-b border-border/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Actions */}
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      className="w-full"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/register">Đăng ký</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
