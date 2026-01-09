import 'dayjs/locale/vi';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bell, FileText, Heart, MessageCircle, User, Users } from 'lucide-react';

import { Notification, ResourceType } from '@/entities/notification/model/types';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface NotificationItemProps {
  item: Notification;
  onRead: (item: Notification) => void;
}

// Helper to strip HTML tags from content
const stripHtml = (html: string | null): string => {
  if (!html) return '';
  // Remove HTML tags and decode entities
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text;
};

export const NotificationItem = ({ item, onRead }: NotificationItemProps) => {
  const isRead = item.readAt !== null;

  const getIcon = (type: ResourceType) => {
    switch (type) {
      case ResourceType.POST:
        return <FileText className="h-3 w-3 fill-blue-500 text-blue-500" />;
      case ResourceType.COMMENT:
      case ResourceType.REPLY:
        return <MessageCircle className="h-3 w-3 fill-blue-500 text-blue-500" />;
      case ResourceType.REACTION:
        return <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />;
      case ResourceType.TOPIC:
      case ResourceType.TOPIC_MEMBER:
        return <Users className="h-3 w-3 fill-green-500 text-green-500" />;
      case ResourceType.DOCUMENT:
        return <FileText className="h-3 w-3 fill-purple-500 text-purple-500" />;
      case ResourceType.USER:
        return <User className="h-3 w-3 fill-orange-500 text-orange-500" />;
      default:
        return <Bell className="h-3 w-3 fill-yellow-500 text-yellow-500" />;
    }
  };

  return (
    <div
      className={cn(
        'hover:bg-muted/50 flex cursor-pointer items-start gap-3 border-b p-3 transition-colors',
        !isRead ? 'bg-blue-50/50 hover:bg-blue-50/70' : 'bg-background',
      )}
      role="button"
      tabIndex={0}
      onClick={() => onRead(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRead(item);
        }
      }}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={item.senderAvatar} alt={item.senderName} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="bg-background ring-border absolute -right-1 -bottom-1 rounded-full p-0.5 shadow-sm ring-1">
          {getIcon(item.resourceType)}
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <p className={cn('text-sm leading-none', !isRead ? 'font-semibold' : 'font-medium')}>
          <span className="font-bold">{item.senderName}</span> {item.title}
        </p>
        {item.content && (
          <p className="text-muted-foreground line-clamp-2 text-xs">{stripHtml(item.content)}</p>
        )}
        <p className="text-muted-foreground text-[10px]">{dayjs(item.deliveredAt).fromNow()}</p>
      </div>

      {!isRead && <span className="bg-primary mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" />}
    </div>
  );
};
