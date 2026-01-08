import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import {
  Notification,
  NotificationResponse,
  NotificationType,
} from '@/entities/notification/model/types';
import { useWS } from '@/shared/realtime/websocket-provider';

import { NOTIFICATION_KEYS } from './use-notifications';

export const useNotificationSocket = () => {
  const { subscribe, connected } = useWS();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe('/user/queue/notifications', (message) => {
      try {
        const newNotification: Notification = JSON.parse(message.body);

        console.log('[use-notification-socket.ts] Received:', newNotification);

        // 1. Play Sound
        try {
          const audio = new Audio('/sound/notification.mp3');
          audio.play().catch((_e) => console.warn('Audio play failed'));
        } catch (_e) {
          /* ignore */
        }

        // 2. Show Toast UI
        toast.info(newNotification.title, {
          description: newNotification.content || undefined,
          action: {
            label: 'Xem',
            onClick: () => {
              // 🎯 CENTRALIZED NAVIGATION LOGIC (Must match NotificationBell)
              switch (newNotification.resourceType) {
                case 'POST':
                  if (newNotification.relatedId) {
                    router.push(`/forum/post/${newNotification.relatedId}`);
                  }
                  break;

                case 'COMMENT':
                case 'REPLY':
                  // ✅ FIX CODERABBIT: Clean URL handling - avoid ?comment= (empty)
                  if (newNotification.relatedId) {
                    const url = newNotification.referenceId
                      ? `/forum/post/${newNotification.relatedId}?comment=${newNotification.referenceId}`
                      : `/forum/post/${newNotification.relatedId}`;
                    router.push(url);
                  }
                  break;

                case 'REACTION':
                  if (newNotification.relatedId) {
                    router.push(`/forum/post/${newNotification.relatedId}`);
                  }
                  break;

                case 'DOCUMENT': {
                  // ✅ SYNCED LOGIC with NotificationBell
                  // TODO: Remove title inference once backend sends 'type' field
                  let notifType: NotificationType | null = newNotification.type || null;

                  // Temporary: Infer from title if type not available
                  if (!notifType) {
                    if (
                      newNotification.title?.includes('Drive') ||
                      newNotification.title?.includes('Export')
                    ) {
                      notifType = NotificationType.DRIVE_UPLOAD;
                    } else if (
                      newNotification.title?.includes('từ chối') ||
                      newNotification.title?.includes('Rejected')
                    ) {
                      notifType = NotificationType.DOCUMENT_REJECTED;
                    } else if (
                      newNotification.title?.includes('duyệt') ||
                      newNotification.title?.includes('Approved')
                    ) {
                      notifType = NotificationType.DOCUMENT_APPROVED;
                    }
                  }

                  switch (notifType) {
                    case NotificationType.DRIVE_UPLOAD:
                      if (newNotification.referenceId) {
                        window.open(
                          `https://docs.google.com/document/d/${newNotification.referenceId}/view`,
                          '_blank',
                        );
                      }
                      break;

                    case NotificationType.DOCUMENT_REJECTED:
                      // Navigate to My Documents for editing
                      if (newNotification.referenceId) {
                        router.push(`/user/my-documents?highlight=${newNotification.referenceId}`);
                      }
                      break;

                    case NotificationType.DOCUMENT_APPROVED:
                    default:
                      // Navigate to public document detail page
                      if (newNotification.referenceId) {
                        router.push(`/documents/${newNotification.referenceId}`);
                      }
                      break;
                  }
                  break;
                }

                case 'TOPIC':
                  if (newNotification.referenceId) {
                    router.push(`/forum/topic/${newNotification.referenceId}`);
                  }
                  break;

                case 'TOPIC_MEMBER':
                  if (newNotification.relatedId) {
                    router.push(`/forum/topic/${newNotification.relatedId}`);
                  }
                  break;

                case 'USER':
                  if (newNotification.senderId) {
                    router.push(`/profile/${newNotification.senderId}`);
                  }
                  break;

                default:
                  console.warn('Unknown resource type:', newNotification.resourceType);
              }
            },
          },
        });

        // 3. Update Unread Count (+1)
        queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old: number | undefined) => {
          return (old || 0) + 1;
        });

        // 4. Optimistic Update: Prepend notification to list
        queryClient.setQueryData(
          NOTIFICATION_KEYS.list(),
          (oldData: { pages: NotificationResponse[]; pageParams: unknown[] } | undefined) => {
            if (!oldData) return oldData;

            const newPages = [...oldData.pages];

            // Add to first page if it exists
            if (newPages.length > 0) {
              const firstPageContent = newPages[0].content || [];

              // Deduplicate: Skip if notification already exists
              if (firstPageContent.some((n: Notification) => n.id === newNotification.id)) {
                return oldData;
              }

              // Prepend new notification to first page
              newPages[0] = {
                ...newPages[0],
                content: [newNotification, ...firstPageContent],
                totalElements: newPages[0].totalElements + 1,
              };
            }

            return { ...oldData, pages: newPages };
          },
        );
      } catch (error) {
        console.error('Error parsing notification socket message:', error);
      }
    });

    return () => unsubscribe();
  }, [connected, subscribe, queryClient, router]);
};
