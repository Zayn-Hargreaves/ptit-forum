'use client';

import * as React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle } from 'lucide-react';

import { commentApi } from '@entities/interaction/api/comment-api';
import { CommentItem } from './ui/comment-item';
import { CommentForm } from './ui/comment-form';
import { useDeleteComment } from '@features/comment/hooks/use-delete-comment';

type CommentSectionProps = Readonly<{ postId: string }>;

export function CommentSection({ postId }: CommentSectionProps) {
  const { data, isLoading, isFetching, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['comments', 'roots', postId],
      initialPageParam: 0,
      queryFn: ({ pageParam }) => commentApi.getRootComments(postId, pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage?.last) return undefined;
        return (lastPage?.number ?? 0) + 1;
      },
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      placeholderData: (prev) => prev,
    });

  const totalRoots = data?.pages?.[0]?.totalElements ?? 0;
  const allRootComments = React.useMemo(() => data?.pages.flatMap((p) => p.content) ?? [], [data]);

  const { mutate: deleteRootComment, isPending: isDeleting } = useDeleteComment({ postId });

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="py-8 flex justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Đang tải bình luận...
      </div>
    );
  } else if (isError) {
    content = (
      <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">Không tải được bình luận.</p>
        <button type="button" onClick={() => refetch()} className="mt-2 text-sm underline underline-offset-4">
          Thử lại
        </button>
      </div>
    );
  } else if (allRootComments.length === 0) {
    content = (
      <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">Chưa có bình luận nào.</p>
        <p className="text-xs text-muted-foreground mt-1">Hãy là người đầu tiên chia sẻ ý kiến!</p>
      </div>
    );
  } else {
    content = (
      <div className="space-y-4">
        {allRootComments.map((root) => (
          <CommentItem
            key={root.id}
            comment={root}
            postId={postId}
            isReply={false}
            onDelete={(id) => {
              if (isDeleting) return;
              deleteRootComment(id);
            }}
            onReplySuccess={handleRefresh}
          />
        ))}

        {hasNextPage ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải thêm...
                </>
              ) : (
                'Tải thêm bình luận'
              )}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6 border-t mt-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Bình luận ({totalRoots})
          {isFetching && !isLoading ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Đang cập nhật...
            </span>
          ) : null}
        </h3>

        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          Làm mới
        </button>
      </div>

      <CommentForm postId={postId} onSuccess={handleRefresh} />

      {content}
    </div>
  );
}
