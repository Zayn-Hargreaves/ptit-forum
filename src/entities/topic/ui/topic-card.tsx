'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@shared/ui/card/card';
import { FileText, Lock, Users } from 'lucide-react';
import Link from 'next/link';

import { ITopic } from '../model/types';

interface TopicCardProps {
  topic: ITopic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/forum/topic/${topic.id}`}>
      <Card className="group h-full cursor-pointer transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="group-hover:border-primary h-12 w-12 border-2 border-transparent transition-colors">
            <AvatarImage src={topic.avatar} alt={topic.name} />
            <AvatarFallback>{topic.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <h3 className="group-hover:text-primary truncate text-lg font-semibold transition-colors">
              {topic.name}
            </h3>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              {!topic.isPublic && <Lock className="h-3 w-3" />}
              <span>{topic.isPublic ? 'Public' : 'Private'}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 min-h-[40px] text-sm">
            {topic.description || 'Chưa có mô tả'}
          </p>
        </CardContent>
        <CardFooter className="text-muted-foreground flex justify-between border-t pt-4 text-xs">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{topic.memberCount || 0} thành viên</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{topic.postCount || 0} bài viết</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
