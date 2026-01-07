'use client';

import { postApi } from '@entities/post/api/post-api';
import { Badge } from '@shared/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';

export default function MyPostsPage() {
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['my-posts'],
    queryFn: () => postApi.getMyPosts(),
  });

  const posts = postsData?.content || [];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-yellow-500 text-yellow-600 dark:text-yellow-400"
          >
            <Clock className="h-3 w-3" />
            Đang chờ duyệt
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-green-500 text-green-600 dark:text-green-400"
          >
            <CheckCircle2 className="h-3 w-3" />
            Đã duyệt
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Đã từ chối
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Bài viết của tôi</h1>
        <p className="text-muted-foreground">Quản lý tất cả bài viết bạn đã tạo</p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="text-muted-foreground mb-4 h-16 w-16" />
            <p className="text-muted-foreground text-lg">Bạn chưa có bài viết nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="mb-2 line-clamp-2 text-xl">{post.title}</CardTitle>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </div>
                  </div>
                  {getStatusBadge(post.postStatus)}
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm text-muted-foreground line-clamp-3 max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span>❤️</span> {post.stats?.likeCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💬</span> {post.stats?.commentCount || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
