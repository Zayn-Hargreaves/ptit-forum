import { Skeleton } from '@shared/ui/skeleton/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Skeleton */}
        <aside className="w-full shrink-0 space-y-8 lg:w-64">
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
        <main className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card text-card-foreground h-[300px] w-full space-y-4 rounded-xl border p-4 shadow"
              >
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
