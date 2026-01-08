'use client';

import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { UserMiniCard } from '@entities/user/ui/user-mini-card';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { useQuery } from '@tanstack/react-query';
import { Info, Shield } from 'lucide-react';

export function TopicSidebar({ topicId }: { topicId: string }) {
  // Fetch actual members from API
  const { data: membersResponse } = useQuery({
    queryKey: ['topic-members', topicId],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: true }),
  });

  // Filter to show only CREATOR (OWNER) and MANAGER
  const admins = (membersResponse?.content || []).filter(
    (m) => m.topicRole === 'OWNER' || m.topicRole === 'MANAGER',
  );

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="text-primary h-5 w-5" />
            Giới thiệu
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            Chào mừng bạn đến với không gian thảo luận. Hãy tuân thủ quy tắc và tôn trọng mọi người.
          </p>
        </CardContent>
      </Card>

      {/* Admins Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="text-primary h-5 w-5" />
            Ban quản trị
          </CardTitle>
        </CardHeader>
        <CardContent className="-mx-2">
          {admins.map((admin) => (
            <UserMiniCard
              key={admin.id}
              user={{
                id: admin.userId,
                fullName: admin.fullName || 'Người dùng ẩn danh',
                avatar: admin.avatarUrl,
                role: admin.topicRole === 'OWNER' ? 'Owner' : 'Moderator',
              }}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
