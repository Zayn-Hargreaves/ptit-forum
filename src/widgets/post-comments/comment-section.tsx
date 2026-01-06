'use client';

import { commentApi } from '@entities/interaction/api/comment-api';
import { useMe } from '@entities/session/model/queries';
import { useDeleteComment } from '@features/comment/hooks/use-delete-comment';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle } from 'lucide-react';
import * as React from 'react';

import { CommentForm } from './ui/comment-form';
import { CommentItem } from './ui/comment-item';

type CommentSectionProps = Readonly<{ postId: string; postAuthorId?: string }>;

export function CommentSection({ postId, postAuthorId }: CommentSectionProps) {
  // 1. Fetch user session once at parent level
  const { data: currentUser } = useMe();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
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

  // 🔍 DEBUG: Trace Props
  React.useEffect(() => {
    console.log('🔍 [CommentSection] Render', {
      postId,
      postAuthorId,
      currentUserId: currentUser?.id,
      currentUserRole: currentUser?.role,
      totalComments: allRootComments.length,
    });
  }, [postId, postAuthorId, currentUser, allRootComments.length]);

  const { mutate: deleteRootComment, isPending: isDeleting } = useDeleteComment({ postId });

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="text-muted-foreground flex justify-center py-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải bình luận...
      </div>
    );
  } else if (isError) {
    content = (
      <div className="bg-muted/10 rounded-lg border border-dashed py-8 text-center">
        <p className="text-muted-foreground text-sm">Không tải được bình luận.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-sm underline underline-offset-4"
        >
          Thử lại
        </button>
      </div>
    );
  } else if (allRootComments.length === 0) {
    content = (
      <div className="bg-muted/10 rounded-lg border border-dashed py-8 text-center">
        <p className="text-muted-foreground text-sm">Chưa có bình luận nào.</p>
        <p className="text-muted-foreground mt-1 text-xs">Hãy là người đầu tiên chia sẻ ý kiến!</p>
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
            postAuthorId={postAuthorId}
            currentUser={currentUser}
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
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition"
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
    <div className="mt-6 space-y-6 border-t pt-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <MessageCircle className="h-5 w-5" />
          Bình luận ({totalRoots})
          {isFetching && !isLoading ? (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Đang cập nhật...
            </span>
          ) : null}
        </h3>

        <button
          type="button"
          onClick={() => refetch()}
          className="text-muted-foreground hover:text-foreground text-xs transition"
        >
          Làm mới
        </button>
      </div>

      <CommentForm postId={postId} onSuccess={handleRefresh} />

      {content}
    </div>
  );
}
