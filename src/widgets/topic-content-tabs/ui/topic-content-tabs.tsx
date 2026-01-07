'use client';

import { MembersTab } from '@app/(app)/forum/topic/[topicId]/_components/tabs/MembersTab';
import { topicApi } from '@entities/topic/api/topic-api';
import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { useTopicRole } from '@entities/topic/model/use-topic-role';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PostFeed } from '@widgets/post-feed/ui/post-feed';
import { TopicLockedView } from '@widgets/topic-locked-view/ui/topic-locked-view';
import { TopicManagementWidget } from '@widgets/topic-management/ui/topic-management-widget';
import { MessageSquare, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

interface TopicContentTabsProps {
  topicId: string;
}

export function TopicContentTabs({ topicId }: TopicContentTabsProps) {
  const { isManager, isMember } = useTopicRole(topicId);
  const queryClient = useQueryClient();

  // Fetch full topic details
  const { data: topic, isLoading } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicApi.getOne(topicId),
  });

  // Join mutation
  const joinMutation = useMutation({
    mutationFn: () => topicMemberApi.joinTopic(topicId),
    onSuccess: (data) => {
      const isApproved = data.approved;
      if (isApproved) {
        toast.success('Đã tham gia nhóm thành công!');
      } else {
        toast.success('Đã gửi yêu cầu tham gia. Vui lòng chờ quản trị viên duyệt.');
      }
      // Refresh topic data
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err?.response?.data?.message || 'Không thể gửi yêu cầu';
      toast.error(message);
    },
  });

  const handleJoinRequest = () => {
    joinMutation.mutate();
  };

  // Loading state
  if (isLoading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  const isPrivate = topic?.topicVisibility === 'PRIVATE';
  const requestStatus = topic?.currentUserContext?.requestStatus || 'NONE';
  const canViewContent = !isPrivate || isMember;

  // ✅ GATE: Show locked view if private and not member
  if (!canViewContent) {
    return (
      <TopicLockedView
        onRequestJoin={handleJoinRequest}
        isPending={requestStatus === 'PENDING'}
        isLoading={joinMutation.isPending}
      />
    );
  }

  // ✅ Show normal content if public OR user is member
  return (
    <Tabs defaultValue="discussion" className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="discussion"
            className="data-[state=active]:border-primary gap-2 rounded-none px-2 py-3 data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <MessageSquare className="h-4 w-4" />
            Thảo luận
          </TabsTrigger>

          <TabsTrigger
            value="members"
            className="data-[state=active]:border-primary gap-2 rounded-none px-2 py-3 data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Users className="h-4 w-4" />
            Thành viên
          </TabsTrigger>

          {isManager && (
            <TabsTrigger
              value="management"
              className="ml-auto gap-2 rounded-none px-2 py-3 font-medium text-red-600/80 hover:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:shadow-none lg:ml-0"
            >
              <Shield className="h-4 w-4" />
              Quản trị
            </TabsTrigger>
          )}
        </TabsList>
      </div>

      <TabsContent
        value="discussion"
        className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300"
      >
        <PostFeed topicId={topicId} />
      </TabsContent>

      <TabsContent
        value="members"
        className="animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <MembersTab topicId={topicId} />
      </TabsContent>

      {isManager && (
        <TabsContent
          value="management"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <TopicManagementWidget topicId={topicId} />
        </TabsContent>
      )}
    </Tabs>
  );
}
