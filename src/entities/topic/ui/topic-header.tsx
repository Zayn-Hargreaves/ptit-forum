'use client';

import { TopicDetail } from '@entities/topic/model/types';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent } from '@shared/ui/card/card';
import { Badge } from '@shared/ui/badge/badge';
import { Users, Lock, Unlock } from 'lucide-react';
import { topicApi } from '@entities/topic/api/topic-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TopicHeaderProps {
  topic: TopicDetail;
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  // const { toast } = useToast(); // Removed
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const { isTopicMember, isTopicManager, isTopicCreator } = topic.currentUserContext || {};
  const isMember = isTopicMember || isTopicManager || isTopicCreator;

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await topicApi.join(topic.id as any);
      toast.success('Đã gửi yêu cầu tham gia chủ đề');
      router.refresh();
    } catch (error) {
      toast.error('Không thể tham gia chủ đề');
    } finally {
        setIsJoining(false);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      <CardContent className="pt-0 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 px-2 gap-4">
          <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-lg shrink-0">
             <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
                {topic.title.charAt(0).toUpperCase()}
             </div>
          </div>
          
          <div className="flex-1 mb-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {topic.title}
              {topic.topicVisibility === 'PRIVATE' ? <Lock className="w-4 h-4 text-muted-foreground" /> : <Unlock className="w-4 h-4 text-muted-foreground" />}
            </h1>
            <p className="text-muted-foreground">{topic.content}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1"> 
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
                 <Button variant="outline" disabled>Đã tham gia</Button>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
