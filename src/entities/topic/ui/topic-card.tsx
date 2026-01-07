'use client';

import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@shared/ui/card/card';
import { Avatar, AvatarImage, AvatarFallback } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { Users, FileText, Lock } from 'lucide-react';
import { ITopic } from '../model/types';

interface TopicCardProps {
  topic: ITopic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/forum/topic/${topic.id}`}>
      <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors">
            <AvatarImage src={topic.avatar} alt={topic.name} />
            <AvatarFallback>{topic.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {topic.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
               {!topic.isPublic && <Lock className="w-3 h-3" />}
               <span>{topic.isPublic ? 'Public' : 'Private'}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {topic.description || 'Chưa có mô tả'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{topic.memberCount || 0} thành viên</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{topic.postCount || 0} bài viết</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
