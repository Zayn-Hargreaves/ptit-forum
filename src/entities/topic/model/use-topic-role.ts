import { useQuery } from '@tanstack/react-query';
import { topicApi } from '@entities/topic/api/topic-api';
import type { TopicRole } from '@features/topic-moderation/lib/permission-utils';

export const useTopicRole = (topicId: string) => {
  const { data: topic } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicApi.getOne(topicId),
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // Extract role from currentUserContext if available
  const context = topic?.currentUserContext;
  
  if (!context) return { role: 'GUEST' as TopicRole, isManager: false, isMember: false, isOwner: false };

  const isMember = context.topicMember || context.topicManager || context.topicCreator;
  const isManager = context.topicManager || context.topicCreator;
  const isOwner = context.topicCreator;

  if (context.topicCreator) return { role: 'OWNER' as TopicRole, isManager: true, isMember: true, isOwner: true };
  if (context.topicManager) return { role: 'MANAGER' as TopicRole, isManager: true, isMember: true, isOwner: false };
  if (context.topicMember) return { role: 'MEMBER' as TopicRole, isManager: false, isMember: true, isOwner: false };

  return { role: 'GUEST' as TopicRole, isManager: false, isMember: false, isOwner: false };
};

