'use client';

import { cn } from '@shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { useMemo } from 'react';

interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  className?: string;
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.codePointAt(i)! + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '000000'.substring(0, 6 - c.length) + c;
}

export function UserAvatar({ name, avatarUrl, className }: Readonly<UserAvatarProps>) {
  const displayName = name || 'User';

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [displayName]);

  const bgColor = useMemo(() => stringToColor(displayName), [displayName]);

  return (
    <Avatar className={cn('border transition-opacity hover:opacity-80', className)}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
      ) : null}

      <AvatarFallback
        className="font-bold text-white"
        style={{ backgroundColor: avatarUrl ? undefined : bgColor }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
