'use client';

import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/card/card';
import { useState } from 'react';
import { Button } from '@shared/ui/button/button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface TopicMembersProps {
  topicId: string;
  isTopicManager?: boolean;
}

export function TopicMembers({ topicId, isTopicManager }: TopicMembersProps) {
  const [activeTab, setActiveTab] = useState<'approved' | 'unapproved'>('approved');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['topic-members', topicId, activeTab],
    queryFn: () => topicMemberApi.getMembers(topicId, { approved: activeTab === 'approved' }),
  });

  const members = (data as any)?.content || [];

  const handleApprove = async (memberId: string) => {
    try {
        await topicMemberApi.approveMember(memberId);
        toast.success("Đã duyệt thành viên");
        queryClient.invalidateQueries({ queryKey: ['topic-members', topicId] });
    } catch (e) {
        toast.error("Lỗi khi duyệt");
    }
  }

  const handleKick = async (memberId: string) => {
      if(!confirm("Bạn có chắc muốn mời thành viên này ra khỏi nhóm?")) return;
      try {
          await topicMemberApi.removeMember(memberId);
          toast.success("Đã mời thành viên ra khỏi nhóm");
          queryClient.invalidateQueries({ queryKey: ['topic-members', topicId] });
      } catch (e) {
          toast.error("Lỗi khi mời ra khỏi nhóm");
      }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Thành viên ({members.length})</CardTitle>
        {isTopicManager && (
            <div className="flex bg-muted rounded-md p-1">
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
            <div className="text-center text-muted-foreground py-8">Không có thành viên nào.</div>
        ) : (
            <div className="space-y-4">
            {members.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={member.user?.avatarUrl || member.avatarUrl} />
                    <AvatarFallback>{(member.user?.fullName || member.fullName)?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-medium text-sm">{member.user?.fullName || member.fullName}</p>
                    <p className="text-xs text-muted-foreground">{member.user?.email || member.email}</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground mr-2">
                        {member.topicRole}
                    </div>
                    
                    {isTopicManager && activeTab === 'unapproved' && (
                        <Button size="sm" onClick={() => handleApprove(member.id)}>Duyệt</Button>
                    )}
                    
                    {isTopicManager && activeTab === 'approved' && member.topicRole !== 'ADMIN' && (
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleKick(member.id)}>
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
