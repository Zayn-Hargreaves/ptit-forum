"use client";

import { useQuery } from "@tanstack/react-query";
import { topicApi } from "@entities/topic/api/topic-api";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@shared/ui/card/card";
import { Skeleton } from "@shared/ui/skeleton/skeleton";

export interface TabProps {
  topicId: string;
}

export function MembersTab({ topicId }: TabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['members', topicId, 'approved'],
    queryFn: () => topicApi.getMembers(topicId, { approved: true, page: 0, size: 20 })
  });
  
  // Note: Pagination UI is simplified here (just first page) as per "Lazy Fetching" focus, 
  // but can be extended with "Load More" or pagination controls.

  if (isLoading) {
     return <div className="space-y-4">
         {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
     </div>
  }

  if (!data || data.content.length === 0) {
    return <div className="text-muted-foreground p-4">No members found.</div>
  }

  return (
    <div className="space-y-4">
      {data.content.map((member: any) => (
        <Card key={member.id} className="items-center flex p-4 justify-between">
           <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.user?.avatarUrl} />
                <AvatarFallback>{member.user?.fullName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                  <div className="font-semibold">{member.user?.fullName}</div>
                  <div className="text-sm text-gray-500">{member.topicRole}</div>
              </div>
           </div>
        </Card>
      ))}
    </div>
  );
}
