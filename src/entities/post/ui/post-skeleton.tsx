import { Skeleton } from '@shared/ui';
import { Card, CardContent, CardHeader } from '@shared/ui/card/card';

export function PostSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-0 p-4 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
