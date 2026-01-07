'use client';

import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import { Card } from '@shared/ui/card/card';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

export interface TabProps {
  topicId: string;
}

export function JoinRequestsTab({ topicId }: TabProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['members', topicId, 'requests'],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: false, page: 0, size: 20 }),
  });

  const approveMutation = useMutation({
    mutationFn: (memberId: string) => topicMemberApi.approveMember(memberId),
    onSuccess: () => {
      toast.success('Member approved');
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'approved'] });
    },
    onError: () => {
      toast.error('Failed to approve');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (memberId: string) => topicMemberApi.removeMember(memberId),
    onSuccess: () => {
      toast.success('Request rejected');
      queryClient.invalidateQueries({ queryKey: ['members', topicId, 'requests'] });
    },
    onError: () => {
      toast.error('Failed to reject');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return <div className="text-muted-foreground p-4">No pending requests.</div>;
  }

  return (
    <div className="space-y-4">
      {data.content.map(
        (member: { id: string; user?: { id: string; fullName?: string; avatarUrl?: string } }) => (
          <Card key={member.id} className="flex items-center justify-between p-4">
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
                className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                onClick={() => approveMutation.mutate(member.id)}
                disabled={approveMutation.isPending}
              >
                <Check className="mr-1 h-4 w-4" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                onClick={() => rejectMutation.mutate(member.id)}
                disabled={rejectMutation.isPending}
              >
                <X className="mr-1 h-4 w-4" /> Reject
              </Button>
            </div>
          </Card>
        ),
      )}
    </div>
  );
}
