'use client';

import { postApi } from '@entities/post/api/post-api';
import { PostCard } from '@entities/post/ui/post-card';
import { CreatePostDialog } from '@features/post/create-post/ui/create-post-dialog';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

interface PostFeedProps {
  topicId: string;
}

export function PostFeed({ topicId }: PostFeedProps) {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
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
        <AlertCircle className="text-destructive mb-2 h-8 w-8" />
        <p className="text-muted-foreground">Không thể tải bài viết.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Post Trigger - Always visible */}
      <CreatePostDialog defaultTopicId={topicId} />

      {/* Empty state or posts list */}
      {!posts || posts.content.length === 0 ? (
        <div className="bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <h3 className="text-lg font-semibold">Chưa có bài viết nào</h3>
          <p className="text-muted-foreground">Hãy là người đầu tiên đăng bài trong chủ đề này!</p>
        </div>
      ) : (
        posts.content.map((post) => <PostCard key={post.id} post={post} topicId={topicId} />)
      )}
    </div>
  );
}
