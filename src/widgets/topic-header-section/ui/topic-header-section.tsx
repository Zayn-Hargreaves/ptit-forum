'use client';

import { TargetType } from '@entities/interaction/model/types';
import { topicApi } from '@entities/topic/api/topic-api';
import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { TopicCover } from '@entities/topic/ui/topic-cover';
import { ReportDialog } from '@features/report/ui/report-dialog';
import { Button } from '@shared/ui/button/button';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Check, Clock, Lock, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TopicHeaderSectionProps {
  topicId: string;
}

export function TopicHeaderSection({ topicId }: TopicHeaderSectionProps) {
  const queryClient = useQueryClient();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const {
    data: topic,
    isLoading,
    isError,
  } = useQuery({
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
          description: 'Bạn có thể xem và tham gia thảo luận ngay bây giờ.',
        });
      } else {
        toast.success('Đã gửi yêu cầu tham gia!', {
          description:
            'Quản trị viên sẽ xem xét yêu cầu của bạn. Bạn sẽ nhận được thông báo khi được chấp nhận.',
          duration: 5000,
        });
      }
      // Refresh topic data
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err?.response?.data?.message || 'Không thể gửi yêu cầu';
      toast.error('Không thể tham gia', {
        description: message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-t-xl" />
        <div className="relative -mt-12 px-6">
          <Skeleton className="border-background h-32 w-32 rounded-xl border-4" />
          <div className="mt-4 max-w-lg space-y-2">
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
        <div className="mt-4 flex flex-col items-end gap-2 px-6">
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Bạn đã là thành viên</span>
          </div>
        </div>
      );
    }

    // Pending approval - show status
    if (requestStatus === 'PENDING') {
      return (
        <div className="mt-4 flex flex-col items-end gap-2 px-6">
          <Button
            disabled
            variant="outline"
            className="border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-50"
          >
            <Clock className="mr-2 h-4 w-4" />
            Đang chờ phê duyệt
          </Button>
          <p className="text-muted-foreground max-w-xs text-right text-xs">
            Yêu cầu của bạn đang được quản trị viên xem xét. Bạn sẽ nhận được thông báo khi được
            chấp nhận.
          </p>
        </div>
      );
    }

    // Not a member - show join button
    const buttonIcon = isPrivate ? (
      <Lock className="mr-2 h-4 w-4" />
    ) : (
      <UserPlus className="mr-2 h-4 w-4" />
    );
    const buttonText = isPrivate ? 'Gửi yêu cầu tham gia' : 'Tham gia ngay';
    const helperText = isPrivate
      ? 'Nhóm riêng tư - Cần được quản trị viên phê duyệt'
      : 'Tham gia để xem và thảo luận trong nhóm';

    return (
      <div className="mt-4 flex flex-col items-end gap-2 px-6">
        <Button
          onClick={() => joinMutation.mutate()}
          disabled={joinMutation.isPending}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          {joinMutation.isPending ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              {buttonIcon}
              {buttonText}
            </>
          )}
        </Button>
        <p className="text-muted-foreground max-w-xs text-right text-xs">{helperText}</p>
      </div>
    );
  };

  return (
    <div className="bg-card relative overflow-hidden rounded-xl border pb-4 shadow-sm">
      <TopicCover topic={topic} />
      {renderJoinSection()}

      <div className="absolute top-6 right-6">
        <Button
          variant="secondary"
          size="sm"
          className="opacity-80 hover:opacity-100"
          onClick={() => setIsReportOpen(true)}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Báo cáo
        </Button>
      </div>

      <ReportDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        targetId={topicId}
        targetType={TargetType.TOPIC}
      />
    </div>
  );
}
