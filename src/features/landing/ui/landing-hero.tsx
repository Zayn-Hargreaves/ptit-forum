"use client";

import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LandingHero() {
    const { user } = useAuth();
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/documents?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Your Academic Knowledge Hub
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            Access thousands of study materials, exams, and lecture notes shared by students.
                            Join the community to learn and grow together.
                        </p>
                    </div>

                    <div className="w-full max-w-lg space-y-4">
                        <form onSubmit={handleSearch} className="flex space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search for subjects, documents..."
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        {!user && (
                            <div className="flex justify-center space-x-4 pt-4">
                                <Button asChild size="lg">
                                    <Link href="/register">
                                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild size="lg">
                                    <Link href="/login">Sign In</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
