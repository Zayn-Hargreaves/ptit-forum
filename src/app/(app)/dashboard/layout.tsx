"use client";

import { useAuth } from "@shared/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@shared/ui";
import {
    FileText,
    User,
    Settings,
    LayoutDashboard,
    Menu,
    MessageSquare,
} from "lucide-react";
import { cn } from "@shared/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@shared/ui/sheet/sheet";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading)
        return (
            <div className="flex h-screen items-center justify-center">Loading...</div>
        );

    if (!isAuthenticated) return null;

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/documents", label: "My Documents", icon: FileText },
        { href: "/dashboard/posts", label: "My Posts", icon: MessageSquare }, // Placeholder for now
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    const SidebarContent = () => (
        <div className="flex h-full flex-col gap-4">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                    <User className="h-6 w-6" />
                    <span>My Dashboard</span>
                </Link>
            </div>
            <nav className="flex-1 overflow-auto py-4">
                <ul className="grid gap-1 px-2 text-sm font-medium">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
                                    pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard")
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{user?.fullName?.[0]?.toUpperCase() || "U"}</span>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
            {/* Desktop Sidebar */}
            <aside className="hidden border-r bg-muted/10 md:block md:w-64">
                <SidebarContent />
            </aside>

            <div className="flex flex-1 flex-col">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <SheetTitle className="sr-only">Dashboard Menu</SheetTitle>
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                    <h1 className="font-semibold">My Dashboard</h1>
                </header>

                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
