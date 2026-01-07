'use client';

import { ITopic } from '../model/types';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { Users, FileText, Lock, Globe } from 'lucide-react';

interface TopicCoverProps {
  topic: ITopic;
}

export function TopicCover({ topic }: TopicCoverProps) {
  return (
    <div className="relative">
      {/* Cover Image Placeholder */}
      <div className="h-48 w-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-t-xl" />
      
      <div className="px-6 pb-6">
        <div className="relative flex items-end -mt-12 mb-4">
           <Avatar className="h-32 w-32 border-4 border-background rounded-xl shadow-md">
              <AvatarImage src={topic.avatar} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground rounded-xl">
                  {topic.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
           </Avatar>
        </div>

        <div className="space-y-4">
            <div>
               <div className="flex items-center gap-3 mb-2">
                   <h1 className="text-3xl font-bold">{topic.name}</h1>
                   <Badge variant={topic.isPublic ? "outline" : "secondary"} className="gap-1">
                      {topic.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {topic.isPublic ? 'Public' : 'Private'}
                   </Badge>
               </div>
               <p className="text-muted-foreground text-lg max-w-3xl">
                  {topic.description}
               </p>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
               <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-foreground text-base">{topic.memberCount || 0}</span> thành viên
               </div>
               <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                   <span className="text-foreground text-base">{topic.postCount || 0}</span> bài viết
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
