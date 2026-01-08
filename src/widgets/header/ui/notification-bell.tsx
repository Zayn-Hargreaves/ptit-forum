'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Bell, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { notificationApi } from '@/entities/notification/api/notification-api';
import { Notification, NotificationType } from '@/entities/notification/model/types';
import { NotificationItem } from '@/entities/notification/ui/notification-item';
import { useNotificationSocket } from '@/features/notifications/model/use-notification-socket';
import { useNotifications, useUnreadCount } from '@/features/notifications/model/use-notifications';
import { Badge, Button, Popover, PopoverContent, PopoverTrigger, ScrollArea } from '@/shared/ui';

export const NotificationBell = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Activate Socket Listener
  useNotificationSocket();

  // 2. Data Hooks
  const { data: unreadCount } = useUnreadCount();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotifications();

  const notifications = (data?.pages.flatMap((page) => page.content) || []).filter(
    (item): item is Notification => !!item,
  );

  // 3. Helper: Infer NotificationType from title (temporary until backend sends type field)
  // TODO: Remove this helper once backend includes 'type' field in UserNotificationResponse
  const inferNotificationType = (item: Notification): NotificationType | null => {
    if (item.type) return item.type; // Use backend type if available

    // Fallback: Infer from title (brittle but temporary)
    if (item.title?.includes('Drive') || item.title?.includes('Export')) {
      return NotificationType.DRIVE_UPLOAD;
    }
    if (item.title?.includes('từ chối') || item.title?.includes('Rejected')) {
      if (item.resourceType === 'POST') return NotificationType.POST_REJECTED;
      if (item.resourceType === 'DOCUMENT') return NotificationType.DOCUMENT_REJECTED;
    }
    if (item.title?.includes('duyệt') || item.title?.includes('Approved')) {
      if (item.resourceType === 'POST') return NotificationType.POST_APPROVED;
      if (item.resourceType === 'DOCUMENT') return NotificationType.DOCUMENT_APPROVED;
    }
    return null;
  };

  // 4. Handle Click Notification
  const handleRead = async (item: Notification) => {
    // UX: Close popover immediately for responsive feel
    setOpen(false);

    // Mark as read (fire-and-forget - don't block navigation)
    if (item.readAt === null) {
      notificationApi
        .markAsRead(item.id)
        .then(() => queryClient.invalidateQueries({ queryKey: ['notifications'] }))
        .catch((e) => console.error('Failed to mark as read:', e));
    }

    // Navigation Logic (Enum-based, robust routing)
    try {
      switch (item.resourceType) {
        case 'POST':
          // Handles both POST_APPROVED and POST_REJECTED
          if (item.relatedId) {
            router.push(`/forum/post/${item.relatedId}`);
          }
          break;

        case 'COMMENT':
        case 'REPLY':
          // Fix: Prevent malformed URL when referenceId is null
          if (item.relatedId) {
            const url = item.referenceId
              ? `/forum/post/${item.relatedId}?comment=${item.referenceId}`
              : `/forum/post/${item.relatedId}`;
            router.push(url);
          }
          break;

        case 'REACTION':
          if (item.relatedId) {
            router.push(`/forum/post/${item.relatedId}`);
          }
          break;

        case 'TOPIC':
          if (item.referenceId) {
            router.push(`/forum/topic/${item.referenceId}`);
          }
          break;

        case 'TOPIC_MEMBER':
          if (item.relatedId) {
            router.push(`/forum/topic/${item.relatedId}`);
          }
          break;

        case 'DOCUMENT': {
          // Robust routing using NotificationType enum
          const notifType = inferNotificationType(item);

          switch (notifType) {
            case NotificationType.DRIVE_UPLOAD:
              // Open Google Docs in new tab
              if (item.referenceId) {
                window.open(
                  `https://docs.google.com/document/d/${item.referenceId}/view`,
                  '_blank',
                );
              }
              break;

            case NotificationType.DOCUMENT_REJECTED:
              // Navigate to My Documents page for editing
              if (item.referenceId) {
                router.push(`/user/my-documents?highlight=${item.referenceId}`);
              }
              break;

            case NotificationType.DOCUMENT_APPROVED:
            default:
              // Navigate to public document detail page
              if (item.referenceId) {
                router.push(`/documents/${item.referenceId}`);
              }
              break;
          }
          break;
        }

        case 'USER':
          if (item.senderId) {
            router.push(`/profile/${item.senderId}`);
          }
          break;

        case 'SYSTEM':
          // System notifications might not need navigation
          break;

        default:
          console.warn('Unhandled notification resource type:', item.resourceType);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Không thể điều hướng tới nội dung này');
    }
  };

  // 5. Handle Mark All Read
  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (e) {
      console.error('Failed to mark all as read:', e);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="text-muted-foreground h-5 w-5" />
          {!!unreadCount && unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full px-0 text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h4 className="text-sm font-semibold">Thông báo</h4>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-auto px-2 text-xs"
              onClick={handleMarkAllRead}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading && notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-muted-foreground flex h-32 flex-col items-center justify-center gap-2">
              <Bell className="h-8 w-8 opacity-20" />
              <p className="text-sm">Không có thông báo nào</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((item) => (
                <NotificationItem key={item.id} item={item} onRead={handleRead} />
              ))}

              {hasNextPage && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="text-muted-foreground w-full text-xs"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      'Xem thêm'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
