'use client';

import { useQuery } from '@tanstack/react-query';
import { postApi } from '@entities/post/api/post-api';
import { PostCard } from '@entities/post/ui/post-card';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { AlertCircle } from 'lucide-react';
import { CreatePostDialog } from '@features/post-create/ui/create-post-dialog';

interface PostFeedProps {
  topicId: string;
}

export function PostFeed({ topicId }: PostFeedProps) {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts', topicId],
    queryFn: () => postApi.getPostsByTopic(topicId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
     return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-muted-foreground">Không thể tải bài viết.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Post Trigger - Always visible */}
      <CreatePostDialog topicId={topicId} />
      
      {/* Empty state or posts list */}
      {!posts || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-lg border border-dashed">
          <h3 className="font-semibold text-lg">Chưa có bài viết nào</h3>
          <p className="text-muted-foreground">Hãy là người đầu tiên đăng bài trong chủ đề này!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} topicId={topicId} />
        ))
      )}
    </div>
  );
}
