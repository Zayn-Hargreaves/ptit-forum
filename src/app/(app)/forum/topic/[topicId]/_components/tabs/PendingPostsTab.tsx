"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@entities/post/api/post-api";
import { PostItem } from "@entities/post/ui/post-item";
import { Skeleton } from "@shared/ui/skeleton/skeleton";
import { Button } from "@shared/ui/button/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

interface TabProps {
  topicId: string;
}

export function PendingPostsTab({ topicId }: TabProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['posts', topicId, 'pending'],
    queryFn: () => postApi.getPendingByTopic(topicId, 0, 20)
  });

  const upgradeMutation = useMutation({
    mutationFn: ({ postId, status }: { postId: string; status: 'APPROVED' | 'REJECTED' }) => 
      postApi.upgradeStatus(postId, status),
    onSuccess: (_, variables) => {
      toast.success(`Post ${variables.status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ['posts', topicId, 'pending'] });
      if (variables.status === 'APPROVED') {
        queryClient.invalidateQueries({ queryKey: ['posts', topicId, 'approved'] });
      }
    },
    onError: () => {
      toast.error("Failed to update post status");
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  if (!data || data.content.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No pending posts to review.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.content.map((post) => (
        <div key={post.id} className="flex flex-col gap-2">
          <PostItem post={post} />
          
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => upgradeMutation.mutate({ postId: post.id, status: 'APPROVED' })}
              disabled={upgradeMutation.isPending}
            >
              <Check className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
               onClick={() => upgradeMutation.mutate({ postId: post.id, status: 'REJECTED' })}
               disabled={upgradeMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
