'use client';

import { topicApi } from '@entities/topic/api/topic-api';
import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useQuery } from '@tanstack/react-query';
import { FileText, Globe, Lock, LucideIcon, Pencil, Users } from 'lucide-react';
import { useState } from 'react';

import { EditTopicForm } from './edit-topic-form';

interface TopicSettingsPanelProps {
  topicId: string;
}

export function TopicSettingsPanel({ topicId }: TopicSettingsPanelProps) {
  const {
    data: topic,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicApi.getTopicDetail(topicId),
  });

  const [isEditing, setIsEditing] = useState(false);
  const canManage =
    topic?.currentUserContext?.topicManager || topic?.currentUserContext?.topicCreator;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !topic) {
    return <div className="py-4 text-center text-red-500">Không thể tải thông tin chủ đề</div>;
  }

  if (isEditing && canManage) {
    return (
      <div className="bg-background rounded-lg border p-6">
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold">Chỉnh sửa thông tin chủ đề</h3>
        </div>
        <EditTopicForm
          topic={topic}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    badge,
  }: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    badge?: React.ReactNode;
  }) => (
    <div className="bg-background flex items-start gap-3 rounded-lg border p-4">
      <Icon className="text-muted-foreground mt-0.5 h-5 w-5" />
      <div className="flex-1">
        <div className="text-muted-foreground mb-1 text-sm">{label}</div>
        <div className="flex items-center gap-2 font-medium">
          {value}
          {badge}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Thông tin chi tiết và cài đặt của chủ đề.
        </div>
        {canManage && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      <InfoRow icon={FileText} label="Tên chủ đề" value={topic.name} />

      <InfoRow
        icon={topic.isPublic ? Globe : Lock}
        label="Trạng thái"
        value={topic.isPublic ? 'Công khai' : 'Riêng tư'}
        badge={
          <Badge variant={topic.isPublic ? 'default' : 'secondary'}>
            {topic.topicVisibility || (topic.isPublic ? 'PUBLIC' : 'PRIVATE')}
          </Badge>
        }
      />

      <div className="bg-background rounded-lg border p-4">
        <div className="mb-2 flex items-center gap-2">
          <FileText className="text-muted-foreground h-5 w-5" />
          <div className="text-muted-foreground text-sm">Mô tả</div>
        </div>
        <div
          className="prose prose-sm max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: topic.description || 'Chưa có mô tả' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoRow icon={Users} label="Thành viên" value={topic.memberCount || 0} />

        <InfoRow icon={FileText} label="Bài viết" value={topic.postCount || 0} />
      </div>

      {topic.currentUserContext && (
        <div className="mt-4 border-t pt-4">
          <div className="mb-3 text-sm font-medium">Quyền của bạn</div>
          <div className="flex flex-wrap gap-2">
            {topic.currentUserContext.topicCreator && (
              <Badge variant="destructive">Người tạo</Badge>
            )}
            {topic.currentUserContext.topicManager && (
              <Badge variant="default">Quản trị viên</Badge>
            )}
            {topic.currentUserContext.topicMember && <Badge variant="secondary">Thành viên</Badge>}
            <Badge variant="outline">Trạng thái: {topic.currentUserContext.requestStatus}</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
