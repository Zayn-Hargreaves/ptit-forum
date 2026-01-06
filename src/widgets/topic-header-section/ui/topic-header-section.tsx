'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicApi } from '@entities/topic/api/topic-api';
import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { TopicCover } from '@entities/topic/ui/topic-cover';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { Button } from '@shared/ui/button/button';
import { toast } from 'sonner';
import { Lock, Check, Clock, UserPlus } from 'lucide-react';

interface TopicHeaderSectionProps {
  topicId: string;
}

export function TopicHeaderSection({ topicId }: TopicHeaderSectionProps) {
  const queryClient = useQueryClient();
  
  const { data: topic, isLoading, isError } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicApi.getOne(topicId),
  });

  // Join mutation
  const joinMutation = useMutation({
    mutationFn: () => topicMemberApi.joinTopic(topicId),
    onSuccess: (data) => {
      const isApproved = data.approved;
      if (isApproved) {
        toast.success('Đã tham gia nhóm thành công!', {
          description: 'Bạn có thể xem và tham gia thảo luận ngay bây giờ.'
        });
      } else {
        toast.success('Đã gửi yêu cầu tham gia!', {
          description: 'Quản trị viên sẽ xem xét yêu cầu của bạn. Bạn sẽ nhận được thông báo khi được chấp nhận.',
          duration: 5000
        });
      }
      // Refresh topic data
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Không thể gửi yêu cầu';
      toast.error('Không thể tham gia', {
        description: message
      });
    },
  });

  if (isLoading) {
    return (
        <div className="space-y-4">
           <Skeleton className="h-48 w-full rounded-t-xl" />
           <div className="px-6 relative -mt-12">
              <Skeleton className="h-32 w-32 rounded-xl border-4 border-background" />
              <div className="mt-4 space-y-2 max-w-lg">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
              </div>
           </div>
        </div>
    );
  }

  if (isError || !topic) {
    return <div className="p-8 text-center text-red-500">Failed to load topic info</div>;
  }

  const context = topic.currentUserContext;
  const isPrivate = topic.topicVisibility === 'PRIVATE';
  const requestStatus = context?.requestStatus || 'NONE';
  const isMember = context?.topicMember || context?.topicManager || context?.topicCreator;

  // Render join/status section
  const renderJoinSection = () => {
    // Already a member - show badge
    if (isMember) {
      return (
        <div className="px-6 mt-4 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Bạn đã là thành viên</span>
          </div>
        </div>
      );
    }

    // Pending approval - show status
    if (requestStatus === 'PENDING') {
      return (
        <div className="px-6 mt-4 flex flex-col items-end gap-2">
          <Button 
            disabled
            variant="outline"
            className="border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-50"
          >
            <Clock className="w-4 h-4 mr-2" />
            Đang chờ phê duyệt
          </Button>
          <p className="text-xs text-muted-foreground text-right max-w-xs">
            Yêu cầu của bạn đang được quản trị viên xem xét. Bạn sẽ nhận được thông báo khi được chấp nhận.
          </p>
        </div>
      );
    }

    // Not a member - show join button
    const buttonIcon = isPrivate ? <Lock className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />;
    const buttonText = isPrivate ? 'Gửi yêu cầu tham gia' : 'Tham gia ngay';
    const helperText = isPrivate 
      ? 'Nhóm riêng tư - Cần được quản trị viên phê duyệt'
      : 'Tham gia để xem và thảo luận trong nhóm';

    return (
      <div className="px-6 mt-4 flex flex-col items-end gap-2">
        <Button 
          onClick={() => joinMutation.mutate()}
          disabled={joinMutation.isPending}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {joinMutation.isPending ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              {buttonIcon}
              {buttonText}
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-right max-w-xs">
          {helperText}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden pb-4">
      <TopicCover topic={topic} />
      {renderJoinSection()}
    </div>
  );
}
