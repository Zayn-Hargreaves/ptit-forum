import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export function DocumentCardSkeleton() {
  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden border bg-card text-card-foreground"
      role="status"
      aria-busy="true"
      aria-label="Loading document card"
    >
      <div className="relative w-full border-b">
        <AspectRatio ratio={3 / 4}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <Skeleton className="h-4 w-20" /> {/* Badge */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex gap-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
