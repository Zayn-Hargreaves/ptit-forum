import { Skeleton } from "@shared/ui/skeleton/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 mb-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </aside>

                {/* Grid Skeleton */}
                <main className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[300px] w-full rounded-xl border bg-card text-card-foreground shadow p-4 space-y-4">
                                <Skeleton className="h-40 w-full rounded-md" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
