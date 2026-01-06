'use client';

import { topicMemberApi } from '@entities/topic/api/topic-member-api';
import { ITopic } from '@entities/topic/model/types';
import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent } from '@shared/ui/card/card';
import { Lock, Unlock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface TopicHeaderProps {
  topic: ITopic;
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  // const { toast } = useToast(); // Removed
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const { topicMember, topicManager, topicCreator } = topic.currentUserContext || {};
  const isMember = topicMember || topicManager || topicCreator;

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await topicMemberApi.joinTopic(topic.id);
      toast.success('Đã gửi yêu cầu tham gia chủ đề');
      router.refresh();
    } catch {
      toast.error('Không thể tham gia chủ đề');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="overflow-hidden border-none bg-white shadow-md">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      <CardContent className="relative pt-0">
        <div className="-mt-12 flex flex-col items-start gap-4 px-2 md:flex-row md:items-end">
          <div className="h-24 w-24 shrink-0 rounded-xl bg-white p-1 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-3xl">
              {topic.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="mb-2 flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              {topic.name}
              {topic.topicVisibility === 'PRIVATE' ? (
                <Lock className="text-muted-foreground h-4 w-4" />
              ) : (
                <Unlock className="text-muted-foreground h-4 w-4" />
              )}
            </h1>
            <p className="text-muted-foreground">{topic.description}</p>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Badge variant="secondary">{topic.categoryName}</Badge>
              {/* <Users className="w-4 h-4" /> <span>{topic.memberCount} thành viên</span>  If available */}
            </div>
          </div>

          <div className="mb-2">
            {!isMember && (
              <Button onClick={handleJoin} disabled={isJoining}>
                {isJoining ? 'Đang xử lý...' : 'Tham gia'}
              </Button>
            )}
            {isMember && (
              <Button variant="outline" disabled>
                Đã tham gia
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
