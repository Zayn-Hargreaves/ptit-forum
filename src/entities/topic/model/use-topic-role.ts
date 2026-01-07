import { topicApi } from '@entities/topic/api/topic-api';
import type { TopicRole } from '@features/topic-moderation/lib/permission-utils';
import { useQuery } from '@tanstack/react-query';

export const useTopicRole = (topicId: string) => {
  const { data: topic } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicApi.getOne(topicId),
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // Extract role from currentUserContext if available
  const context = topic?.currentUserContext;

  if (!context)
    return { role: 'GUEST' as TopicRole, isManager: false, isMember: false, isOwner: false };

  const isMember = context.topicMember || context.topicManager || context.topicCreator;
  const isManager = !!(context.topicManager || context.topicCreator);
  const isOwner = !!context.topicCreator;

  let role: TopicRole = 'GUEST';
  if (isOwner) role = 'OWNER';
  else if (isManager) role = 'MANAGER';
  else if (isMember) role = 'MEMBER';

  return { role, isManager, isMember, isOwner };
};
