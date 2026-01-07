'use client';

import { useQuery } from '@tanstack/react-query';
import { postApi } from '@entities/post/api/post-api';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Badge } from '@shared/ui/badge/badge';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function MyPostsPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['my-posts'],
    queryFn: () => postApi.getMyPosts()
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-600 dark:text-yellow-400">
          <Clock className="w-3 h-3" />
          Đang chờ duyệt
        </Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3" />
          Đã duyệt
        </Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Đã từ chối
        </Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Bài viết của tôi</h1>
        <p className="text-muted-foreground">Quản lý tất cả bài viết bạn đã tạo</p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Bạn chưa có bài viết nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl mb-2 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: vi
                      })}
                    </div>
                  </div>
                  {getStatusBadge(post.postStatus)}
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none line-clamp-3 text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span>❤️</span> {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💬</span> {post.commentCount}
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
