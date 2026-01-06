'use client';

import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TopicMembersProps {
  topicId: string;
  topicManager?: boolean;
}

export function TopicMembers({ topicId, topicManager }: TopicMembersProps) {
  const [activeTab, setActiveTab] = useState<'approved' | 'unapproved'>('approved');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['topic-members', topicId, activeTab],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: activeTab === 'approved' }),
  });

  const members = data?.content || [];

  const handleApprove = async (memberId: string) => {
    try {
      await topicMemberApi.approveMember(memberId);
      toast.success('Đã duyệt thành viên');
      queryClient.invalidateQueries({ queryKey: ['topic-members', topicId] });
    } catch {
      toast.error('Lỗi khi duyệt');
    }
  };

  const handleKick = async (memberId: string) => {
    if (!confirm('Bạn có chắc muốn mời thành viên này ra khỏi nhóm?')) return;
    try {
      await topicMemberApi.removeMember(memberId);
      toast.success('Đã mời thành viên ra khỏi nhóm');
      queryClient.invalidateQueries({ queryKey: ['topic-members', topicId] });
    } catch {
      toast.error('Lỗi khi mời ra khỏi nhóm');
    }
  };

  // Helper to safely get initials
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Thành viên ({members.length})</CardTitle>
        {topicManager && (
          <div className="bg-muted flex rounded-md p-1">
            <Button
              variant={activeTab === 'approved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('approved')}
              className="h-8"
            >
              Đã tham gia
            </Button>
            <Button
              variant={activeTab === 'unapproved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('unapproved')}
              className="h-8"
            >
              Chờ duyệt
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Đang tải thành viên...</div>
        ) : members.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">Không có thành viên nào.</div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{member.fullName}</p>
                  <p className="text-muted-foreground text-xs">{member.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground mr-2 text-xs">{member.topicRole}</div>

                  {topicManager && activeTab === 'unapproved' && (
                    <Button size="sm" onClick={() => handleApprove(member.id)}>
                      Duyệt
                    </Button>
                  )}

                  {topicManager && activeTab === 'approved' && member.topicRole !== 'OWNER' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive h-8 w-8"
                      onClick={() => handleKick(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
