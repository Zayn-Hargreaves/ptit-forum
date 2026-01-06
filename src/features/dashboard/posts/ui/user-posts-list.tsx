'use client';

import { postApi } from '@entities/post/api/post-api';
import { Badge, Button, Card, CardContent } from '@shared/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Eye, MessageSquare, ThumbsUp, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserPostsList() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['my-posts', page],
    queryFn: () => postApi.getMyPosts(page, 10),
  });

  const posts = postsData?.content || [];
  const totalPages = postsData?.totalPages || 0;

  const deleteMutation = useMutation({
    mutationFn: postApi.delete,
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading posts...</div>;

  if (posts.length === 0) {
    return (
      <div className="text-muted-foreground bg-muted/10 rounded-lg border py-10 text-center">
        You haven&apos;t posted anything yet.
        <br />
        <Button variant="link" asChild>
          <Link href="/forum">Go to Forum</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/forum/post/${post.id}`}
                    className="line-clamp-1 text-lg font-semibold hover:underline"
                  >
                    {post.title}
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {post.topic?.name || 'General'}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {post.stats?.viewCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {post.stats?.commentCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" /> {post.stats?.likeCount || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/forum/post/${post.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="py-2 text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
