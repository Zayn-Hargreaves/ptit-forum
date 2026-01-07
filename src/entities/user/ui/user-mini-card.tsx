'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';

interface UserMiniCardProps {
  user: {
    id: string;
    fullName: string;
    avatar?: string;
    role?: string;
  };
}

export function UserMiniCard({ user }: UserMiniCardProps) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar} alt={user.fullName} />
        <AvatarFallback>{user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="overflow-hidden">
        <p className="font-medium text-sm truncate">{user.fullName}</p>
        <p className="text-xs text-muted-foreground">{user.role || 'Member'}</p>
      </div>
    </div>
  );
}
