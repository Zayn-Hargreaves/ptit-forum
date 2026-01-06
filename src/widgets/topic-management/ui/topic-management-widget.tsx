'use client';

import { MemberManagementList } from '@features/topic-moderation/ui/member-management-list';
import { PendingPostList } from '@features/topic-moderation/ui/pending-post-list';
import { TopicSettingsPanel } from '@features/topic-moderation/ui/topic-settings-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { ShieldAlert } from 'lucide-react';

// Assuming we have a permission hook or just checking props for now
// Ideally: const { role } = useTopicPermission(topicId);

interface TopicManagementWidgetProps {
  topicId: string;
}

export function TopicManagementWidget({ topicId }: TopicManagementWidgetProps) {
  // TODO: Add permission check here. Return null if not Manager/Owner.
  // const { role } = useTopicRole(topicId);
  // if (!['MANAGER', 'OWNER'].includes(role)) return null;

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-amber-700">
          <ShieldAlert className="h-5 w-5" />
          Quản trị viên
        </CardTitle>
        <CardDescription>Công cụ quản lý chủ đề dành cho Manager</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="pending">Phê duyệt bài</TabsTrigger>
            <TabsTrigger value="members">Thành viên</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <PendingPostList topicId={topicId} />
          </TabsContent>

          <TabsContent value="members">
            <MemberManagementList topicId={topicId} />
          </TabsContent>

          <TabsContent value="settings">
            <TopicSettingsPanel topicId={topicId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
