'use client';

import { useQuery } from '@tanstack/react-query';
import { topicApi } from '@entities/topic/api/topic-api';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { Badge } from '@shared/ui/badge/badge';
import { useState } from 'react';
import { Button } from '@shared/ui/button/button';
import { EditTopicForm } from './edit-topic-form';
import { Globe, Lock, Calendar, Users, FileText, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TopicSettingsPanelProps {
  topicId: string;
}

export function TopicSettingsPanel({ topicId }: TopicSettingsPanelProps) {
  const { data: topic, isLoading, isError } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicApi.getTopicDetail(topicId),
  });

  const [isEditing, setIsEditing] = useState(false);
  const canManage = topic?.currentUserContext?.topicManager || topic?.currentUserContext?.topicCreator;

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
    return (
      <div className="text-red-500 py-4 text-center">
        Không thể tải thông tin chủ đề
      </div>
    );
  }

  if (isEditing && canManage) {
      return (
          <div className="bg-background border rounded-lg p-6">
              <div className="mb-6 pb-4 border-b">
                  <h3 className="text-lg font-semibold">Chỉnh sửa thông tin chủ đề</h3>
              </div>
              <EditTopicForm 
                topic={topic}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
              />
          </div>
      )
  }

  const InfoRow = ({ icon: Icon, label, value, badge }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    badge?: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-background">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="font-medium flex items-center gap-2">
          {value}
          {badge}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
            Thông tin chi tiết và cài đặt của chủ đề.
        </div>
        {canManage && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Chỉnh sửa
            </Button>
        )}
      </div>

      <InfoRow
        icon={FileText}
        label="Tên chủ đề"
        value={topic.name}
      />

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

      <div className="border rounded-lg bg-background p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Mô tả</div>
        </div>
        <div 
          className="text-sm leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: topic.description || 'Chưa có mô tả' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoRow
          icon={Users}
          label="Thành viên"
          value={topic.memberCount || 0}
        />

        <InfoRow
          icon={FileText}
          label="Bài viết"
          value={topic.postCount || 0}
        />
      </div>

      {topic.currentUserContext && (
        <div className="border-t pt-4 mt-4">
          <div className="text-sm font-medium mb-3">Quyền của bạn</div>
          <div className="flex flex-wrap gap-2">
            {topic.currentUserContext.topicCreator && (
              <Badge variant="destructive">Người tạo</Badge>
            )}
            {topic.currentUserContext.topicManager && (
              <Badge variant="default">Quản trị viên</Badge>
            )}
            {topic.currentUserContext.topicMember && (
              <Badge variant="secondary">Thành viên</Badge>
            )}
            <Badge variant="outline">
              Trạng thái: {topic.currentUserContext.requestStatus}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
