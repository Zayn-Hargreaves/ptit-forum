'use client';

import { cn } from '@shared/lib/utils';
import { useAuth } from '@shared/providers/auth-provider';
import { Button } from '@shared/ui';
import {
  FileText,
  GraduationCap,
  LogOut,
  Megaphone,
  Presentation,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user?.role !== 'ADMIN') {
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // Tiny flash prevention if redirecting
  if (!user || user.role !== 'ADMIN') return null;

  const navItems = [
    { href: '/admin/faculties', label: 'Faculties', icon: GraduationCap },
    { href: '/admin/classrooms', label: 'Classrooms', icon: Presentation },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/documents', label: 'Documents', icon: FileText },
      {href: "/admin/categories", label: "Categories", icon: FileText},
      {href: "/admin/topics", label: "Topics", icon: FileText},
      {href: "/admin/semesters", label: "Semesters", icon: FileText},
      { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-slate-900 text-slate-50 md:flex">
        <div className="flex h-14 items-center border-b border-slate-800 px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin/documents" className="flex items-center gap-2 text-lg font-bold">
            <span className="">Admin CRM</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-2 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-slate-800',
                    pathname.startsWith(item.href) ? 'bg-slate-800 text-white' : 'text-slate-400',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-slate-800 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
            asChild
          >
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" /> Exit Admin
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-muted/40 flex h-14 shrink-0 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
