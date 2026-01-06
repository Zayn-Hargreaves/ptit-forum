'use client';

import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';

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
    <div className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors">
      <UserAvatar name={user.fullName} avatarUrl={user.avatar} className="h-10 w-10" />
      <div className="overflow-hidden">
        <p className="truncate text-sm font-medium">{user.fullName}</p>
        <p className="text-muted-foreground text-xs">{user.role || 'Member'}</p>
      </div>
    </div>
  );
}
