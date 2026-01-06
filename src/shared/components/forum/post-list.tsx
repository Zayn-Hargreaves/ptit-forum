'use client';

import { postApi } from '@entities/post/api/post-api';
import {
  type SortMode,
  type TimeRange,
  useInfinitePosts,
} from '@entities/post/model/use-infinite-posts';
import { PostItem } from '@entities/post/ui/post-item';
import { PostSkeleton } from '@entities/post/ui/post-skeleton';
import { Button } from '@shared/ui/button/button';
import { AlertCircle, FileQuestion, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

interface PostListProps {
  topicId?: string | null;
  authorId?: string | null;
  sortMode?: SortMode;
  timeRange?: TimeRange;
}

export function PostList({
  topicId = null,
  authorId = null,
  sortMode = 'latest',
  timeRange = 'all',
  fetchMode = 'feed', // Default to feed
}: Readonly<PostListProps & { fetchMode?: 'feed' | 'topic' | 'pending' }>) {
  // 1. Destructuring hook một cách rõ ràng
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, // Trạng thái load lần đầu
    isError,
    refetch, // Cần function này để làm nút "Thử lại"
    error,
  } = useInfinitePosts({
    topicId,
    authorId,
    sortMode,
    timeRange,
    fetchMode,
  });

  // 2. Intersection Observer configuration
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px', // SENIOR TRICK: Pre-fetch khi còn cách đáy 400px. UX mượt hơn hẳn.
  });

  // 3. Effect để trigger load more
  useEffect(() => {
    // Chỉ fetch khi: Đang nhìn thấy đáy + Còn trang sau + Không đang fetch dở + Không bị lỗi
    if (inView && hasNextPage && !isFetchingNextPage && !isError) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  // ================= RENDER STATES =================

  // CASE 1: Initial Loading (Skeleton)
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Render 3 skeleton giả lập 3 bài viết đang load */}
        {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((key) => (
          <PostSkeleton key={key} />
        ))}
      </div>
    );
  }

  // CASE 2: Error State (Có nút Retry)
  if (isError) {
    return (
      <div className="bg-destructive/5 border-destructive/20 flex flex-col items-center justify-center space-y-3 rounded-lg border py-10 text-center">
        <AlertCircle className="text-destructive h-10 w-10" />
        <div className="space-y-1">
          <p className="text-destructive font-medium">Không thể tải bài viết</p>
          <p className="text-muted-foreground text-sm">
            {error instanceof Error ? error.message : 'Lỗi không xác định'}
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="mt-2">
          Thử lại
        </Button>
      </div>
    );
  }

  // CASE 3: Empty State (Không có bài nào)
  const posts = data?.posts ?? [];
  if (posts.length === 0) {
    return (
      <div className="bg-muted/5 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
        <div className="bg-muted mb-3 rounded-full p-4">
          <FileQuestion className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">Chưa có bài viết nào</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Chủ đề này hiện tại đang trống. Hãy là người đầu tiên bắt đầu cuộc trò chuyện!
        </p>
      </div>
    );
  }

  // CASE 4: Success List
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          actions={
            fetchMode === 'pending' ? (
              <>
                <Button
                  size="sm"
                  className="z-20 bg-green-600 text-white hover:bg-green-700"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link click
                    toast.promise(postApi.approvePost(post.id), {
                      loading: 'Đang duyệt...',
                      success: () => {
                        refetch();
                        return 'Đã duyệt bài viết';
                      },
                      error: 'Lỗi khi duyệt bài',
                    });
                  }}
                >
                  Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="z-20"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!confirm('Chắc chắn từ chối bài này?')) return;
                    toast.promise(postApi.rejectPost(post.id), {
                      loading: 'Đang từ chối...',
                      success: () => {
                        refetch();
                        return 'Đã từ chối bài viết';
                      },
                      error: 'Lỗi khi từ chối',
                    });
                  }}
                >
                  Từ chối
                </Button>
              </>
            ) : null
          }
        />
      ))}

      {/* Infinite Scroll Trigger Area */}
      <div ref={ref} className="flex min-h-[60px] flex-col items-center justify-center py-6">
        {(() => {
          if (isFetchingNextPage) {
            return (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="text-primary h-5 w-5 animate-spin" />
                <span>Đang tải thêm...</span>
              </div>
            );
          } else if (hasNextPage) {
            return <div className="h-4 w-full" />;
          } else {
            return (
              <div className="bg-muted/20 text-muted-foreground flex items-center gap-2 rounded-full px-4 py-2 text-xs">
                <span>🎉 Bạn đã xem hết bài viết</span>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}
