'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@entities/post/api/post-api';
import { Button } from '@shared/ui/button/button';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Check, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getUserDisplayName, getUserInitials, getAvatarUrl } from '@shared/lib/user-display-utils';
import Link from 'next/link';

interface PendingPostListProps {
  topicId: string;
}

export function PendingPostList({ topicId }: PendingPostListProps) {
  const queryClient = useQueryClient();

  const { data: posts, isLoading, isError } = useQuery({
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
    onError: () => toast.error('Lỗi khi duyệt bài')
  });

  const rejectMutation = useMutation({
    mutationFn: (postId: string) => postApi.rejectPost(postId),
    onSuccess: () => {
      toast.success('Đã từ chối bài viết');
      queryClient.invalidateQueries({ queryKey: ['posts', 'pending', topicId] });
    },
    onError: () => toast.error('Lỗi khi từ chối bài')
  });

  if (isLoading) return <div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>;
  
  if (isError) return <div className="text-red-500 py-4 text-center">Không thể tải danh sách chờ duyệt</div>;

  if (!posts || posts.length === 0) {
      return <div className="text-center py-8 text-muted-foreground italic">Không có bài viết nào chờ duyệt</div>;
  }

  return (
    <div className="space-y-3">
      {posts.map(post => {
        const authorName = getUserDisplayName(post.author?.fullName);
        const authorAvatar = getAvatarUrl(post.author?.avatar);
        const authorInitials = getUserInitials(post.author?.fullName);

        return (
          <div key={post.id} className="flex items-start justify-between p-3 border rounded-lg bg-background shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={authorAvatar} />
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1 flex-1 min-w-0">
                      <Link 
                        href={`/forum/post/${post.id}`}
                        className="font-semibold line-clamp-1 hover:text-primary hover:underline transition-colors"
                      >
                        {post.title}
                      </Link>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{authorName}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}</span>
                      </div>
                  </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/forum/post/${post.id}`}>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Xem chi tiết"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Duyệt"
                    disabled={approveMutation.isPending}
                    onClick={() => approveMutation.mutate(post.id)}
                  >
                      <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
