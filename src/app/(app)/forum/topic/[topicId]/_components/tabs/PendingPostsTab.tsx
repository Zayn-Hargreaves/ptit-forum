'use client';

import { postApi } from '@entities/post/api/post-api';
import { PostItem } from '@entities/post/ui/post-item';
import { Button } from '@shared/ui/button/button';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface TabProps {
  topicId: string;
}

export function PendingPostsTab({ topicId }: TabProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['posts', topicId, 'pending'],
    queryFn: () => postApi.getPendingPostsByTopic(topicId, 0, 20),
  });

  const posts = data?.content || [];

  const upgradeMutation = useMutation({
    mutationFn: ({ postId, status }: { postId: string; status: 'APPROVED' | 'REJECTED' }) =>
      status === 'APPROVED' ? postApi.approvePost(postId) : postApi.rejectPost(postId),
    onSuccess: (_, variables) => {
      toast.success(`Post ${variables.status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ['posts', topicId, 'pending'] });
      if (variables.status === 'APPROVED') {
        queryClient.invalidateQueries({ queryKey: ['posts', topicId, 'approved'] });
      }
    },
    onError: () => {
      toast.error('Failed to update post status');
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-muted-foreground py-10 text-center">No pending posts to review.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="flex flex-col gap-2">
          <PostItem post={post} />

          <div className="flex w-full gap-2">
            <Button
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
              onClick={() => upgradeMutation.mutate({ postId: post.id, status: 'APPROVED' })}
              disabled={upgradeMutation.isPending}
            >
              <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={() => upgradeMutation.mutate({ postId: post.id, status: 'REJECTED' })}
              disabled={upgradeMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
