import { AspectRatio } from '@/shared/ui/aspect-ratio/aspect-ratio';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

export const DocumentCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <AspectRatio ratio={3 / 4}>
        <Skeleton className="h-full w-full rounded-md" />
      </AspectRatio>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
};
