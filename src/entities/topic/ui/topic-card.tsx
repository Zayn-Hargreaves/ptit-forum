'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@shared/ui/card/card';
import { Badge } from '@shared/ui/badge/badge';
import { Users, FileText, Lock } from 'lucide-react';
import { Topic } from '@entities/topic/model/types';

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/forum/topic/${topic.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-1">
              {topic.title}
            </CardTitle>
            {topic.topicVisibility === 'PRIVATE' && (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {topic.content || 'Chưa có mô tả'}
          </p>
        </CardHeader>
        <CardContent className="pb-2">
             {/* Stats can go here if available in list API */}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground gap-4 border-t pt-3">
            <div className="flex items-center gap-1">
                 <Users className="w-3 h-3" />
                 <span>Thành viên</span>
            </div>
             <div className="flex items-center gap-1">
                 <FileText className="w-3 h-3" />
                 <span>Bài viết</span>
            </div>
             <Badge variant="secondary" className="ml-auto font-normal">
                {topic.categoryName}
             </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
