'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/card/card';
import { UserMiniCard } from '@entities/user/ui/user-mini-card';
import { Info, Shield } from 'lucide-react';
import { topicMemberApi } from '@entities/topic/api/topic-member-api';

export function TopicSidebar({ topicId }: { topicId: string }) {
  // Fetch actual members from API
  const { data: membersResponse } = useQuery({
    queryKey: ['topic-members', topicId],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: true })
  });

  // Filter to show only CREATOR (OWNER) and MANAGER
  const admins = (membersResponse?.content || []).filter(m => 
    m.topicRole === 'OWNER' || m.topicRole === 'MANAGER'
  );

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-5 h-5 text-primary" />
              Giới thiệu
           </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Chào mừng bạn đến với không gian thảo luận. Hãy tuân thủ quy tắc và tôn trọng mọi người.</p>
        </CardContent>
      </Card>

      {/* Admins Card */}
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-5 h-5 text-primary" />
              Ban quản trị
           </CardTitle>
        </CardHeader>
        <CardContent className="-mx-2">
            {admins.map(admin => (
                <UserMiniCard 
                  key={admin.id} 
                  user={{
                    id: admin.user?.id || admin.userId,
                    fullName: admin.user?.fullName || (admin as any).fullName || 'Unknown',
                    avatar: admin.user?.avatarUrl || (admin as any).avatarUrl,
                    role: admin.topicRole === 'OWNER' ? 'Owner' : 'Moderator'
                  }} 
                />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
