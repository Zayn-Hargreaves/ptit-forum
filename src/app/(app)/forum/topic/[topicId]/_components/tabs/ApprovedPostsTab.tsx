"use client";

import { useQuery } from "@tanstack/react-query";
import { postApi } from "@entities/post/api/post-api";
import { PostItem } from "@entities/post/ui/post-item";
import { Skeleton } from "@shared/ui/skeleton/skeleton";

interface TabProps {
  topicId: string;
}

export function ApprovedPostsTab({ topicId }: TabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', topicId, 'approved'],
    queryFn: () => postApi.getByTopic(topicId, { pageParam: 0, size: 20 })
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
             <Skeleton className="h-[200px] w-full rounded-xl" />
             <div className="space-y-2">
               <Skeleton className="h-4 w-[250px]" />
               <Skeleton className="h-4 w-[200px]" />
             </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle empty
  if (!data || data.content.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No discussions yet. Start one!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.content.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
