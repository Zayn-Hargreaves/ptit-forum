"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { topicApi } from "@entities/topic/api/topic-api";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Card } from "@shared/ui/card/card";
import { Skeleton } from "@shared/ui/skeleton/skeleton";
import { Button } from "@shared/ui/button/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export interface TabProps {
  topicId: string;
}

export function JoinRequestsTab({ topicId }: TabProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['members', topicId, 'requests'],
    queryFn: () => topicApi.getMembers(topicId, { approved: false, page: 0, size: 20 })
  });

  const approveMutation = useMutation({
    mutationFn: (memberId: string) => topicApi.approveMember(memberId),
    onSuccess: () => {
      toast.success("Member approved");
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'approved'] });
    },
    onError: () => {
      toast.error("Failed to approve");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) => topicApi.rejectMember(topicId, userId),
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'requests'] });
    },
    onError: () => {
      toast.error("Failed to reject");
    }
  });

  if (isLoading) {
     return <div className="space-y-4">
         {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
     </div>
  }

  if (!data || data.content.length === 0) {
    return <div className="text-muted-foreground p-4">No pending requests.</div>
  }

  return (
    <div className="space-y-4">
      {data.content.map((member: any) => (
        <Card key={member.id} className="items-center flex p-4 justify-between">
           <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.user?.avatarUrl} />
                <AvatarFallback>{member.user?.fullName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                  <div className="font-semibold">{member.user?.fullName}</div>
                  <div className="text-sm text-gray-500">Requesting to join</div>
              </div>
           </div>
           
           <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                onClick={() => approveMutation.mutate(member.id)}
                disabled={approveMutation.isPending}
              >
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                onClick={() => rejectMutation.mutate({ userId: member.user.id })}
                disabled={rejectMutation.isPending}
              >
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
           </div>
        </Card>
      ))}
    </div>
  );
}
