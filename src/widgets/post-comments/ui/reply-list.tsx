'use client';

import { commentApi } from '@entities/interaction/api/comment-api';
import { useDeleteComment } from '@features/comment/hooks/use-delete-comment';
import { Button } from '@shared/ui/button/button';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { CornerDownRight, Loader2 } from 'lucide-react';

import { CommentItem } from './comment-item';

interface ReplyListProps {
  rootCommentId: string;
  postId: string;
}

export function ReplyList({ rootCommentId, postId }: Readonly<ReplyListProps>) {
  const queryClient = useQueryClient();
  const queryKey = ['comments', 'replies', rootCommentId] as const;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => commentApi.getReplies(rootCommentId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });

  const { mutate: deleteReply, isPending: isDeleting } = useDeleteComment({
    postId,
    rootCommentId,
  });

  const handleReplySuccess = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ['comments', 'roots', postId] });
  };

  if (status === 'pending') {
    return (
      <div className="ml-12 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-destructive ml-12 py-2 text-sm">
        Không thể tải phản hồi. Vui lòng thử lại.
      </div>
    );
  }

  const replies = data?.pages.flatMap((page) => page.content) || [];

  return (
    <div className="mt-2 ml-8 space-y-3 md:ml-12">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          isReply={true}
          onDelete={(id) => {
            if (isDeleting) return;
            deleteReply(id);
          }}
          onReplySuccess={handleReplySuccess}
        />
      ))}

      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="text-muted-foreground ml-2 text-xs"
        >
          <CornerDownRight className="mr-1 h-3 w-3" />
          {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm phản hồi'}
        </Button>
      )}
    </div>
  );
}
