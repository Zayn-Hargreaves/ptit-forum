'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { FileText, Globe, Lock, Users } from 'lucide-react';

import { ITopic } from '../model/types';

interface TopicCoverProps {
  topic: ITopic;
}

export function TopicCover({ topic }: TopicCoverProps) {
  return (
    <div className="relative">
      {/* Cover Image Placeholder */}
      <div className="h-48 w-full rounded-t-xl bg-linear-to-r from-blue-500 to-cyan-500" />

      <div className="px-6 pb-6">
        <div className="relative -mt-12 mb-4 flex items-end">
          <Avatar className="border-background h-32 w-32 rounded-xl border-4 shadow-md">
            <AvatarImage src={topic.avatar} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground rounded-xl text-4xl font-bold">
              {topic.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold">{topic.name}</h1>
              <Badge variant={topic.isPublic ? 'outline' : 'secondary'} className="gap-1">
                {topic.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {topic.isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-3xl text-lg">{topic.description}</p>
          </div>

          <div className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Users className="text-primary h-5 w-5" />
              <span className="text-foreground text-base">{topic.memberCount || 0}</span> thành viên
            </div>
            <div className="flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              <span className="text-foreground text-base">{topic.postCount || 0}</span> bài viết
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
