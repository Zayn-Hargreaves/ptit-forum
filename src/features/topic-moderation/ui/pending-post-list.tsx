'use client';

import { postApi } from '@entities/post/api/post-api';
import { getAvatarUrl, getUserDisplayName, getUserInitials } from '@shared/lib/user-display-utils';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Check, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface PendingPostListProps {
  topicId: string;
}

export function PendingPostList({ topicId }: PendingPostListProps) {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts', 'pending', topicId],
    queryFn: () => postApi.getPendingPostsByTopic(topicId),
  });

  const approveMutation = useMutation({
    mutationFn: (postId: string) => postApi.approvePost(postId),
    onSuccess: () => {
      toast.success('Đã duyệt bài viết');
      queryClient.invalidateQueries({ queryKey: ['posts', 'pending', topicId] });
      queryClient.invalidateQueries({ queryKey: ['posts', topicId] }); // Refresh public feed
    },
    onError: () => toast.error('Lỗi khi duyệt bài'),
  });

  const rejectMutation = useMutation({
    mutationFn: (postId: string) => postApi.rejectPost(postId),
    onSuccess: () => {
      toast.success('Đã từ chối bài viết');
      queryClient.invalidateQueries({ queryKey: ['posts', 'pending', topicId] });
    },
    onError: () => toast.error('Lỗi khi từ chối bài'),
  });

  if (isLoading)
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );

  if (isError)
    return <div className="py-4 text-center text-red-500">Không thể tải danh sách chờ duyệt</div>;

  if (!posts || posts.content.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center italic">
        Không có bài viết nào chờ duyệt
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.content.map((post) => {
        const authorName = getUserDisplayName(post.author?.fullName || post.author?.email);
        const authorAvatar = getAvatarUrl(post.author?.avatarUrl);
        const authorInitials = getUserInitials(post.author?.fullName || post.author?.email);

        return (
          <div
            key={post.id}
            className="bg-background flex items-start justify-between rounded-lg border p-3 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={authorAvatar} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 gap-1">
                <Link
                  href={`/forum/post/${post.id}`}
                  className="hover:text-primary line-clamp-1 font-semibold transition-colors hover:underline"
                >
                  {post.title}
                </Link>
                <div className="text-muted-foreground flex gap-2 text-xs">
                  <span>{authorName}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <Link href={`/forum/post/${post.id}`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  title="Xem chi tiết"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                title="Duyệt"
                disabled={approveMutation.isPending}
                onClick={() => approveMutation.mutate(post.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                title="Từ chối"
                disabled={rejectMutation.isPending}
                onClick={() => rejectMutation.mutate(post.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
