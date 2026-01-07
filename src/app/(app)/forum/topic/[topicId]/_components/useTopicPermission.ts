import { Topic } from '@entities/topic/model/types';
import { useAuth } from '@shared/providers/auth-provider';
import { useMemo } from 'react';

export const useTopicPermission = (topic: Topic) => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return {
        canManage: false,
        isCreator: false,
        isMember: false, // Need member check logic if available
      };
    }

    // Backend should ideally return canManageTopic, but if not:
    // 1. Check if user is Admin
    const isAdmin = user.role === 'ADMIN';

    // 2. Check flags from backend context
    const isCreator = topic.currentUserContext?.topicCreator || false;
    const isManager = topic.currentUserContext?.topicManager || false;
    const isMember = topic.currentUserContext?.topicMember || false;

    // 3. canManage if Admin, Creator, or Manager
    const canManage = isAdmin || isCreator || isManager;

    return {
      canManage,
      isCreator,
      isMember,
    };
  }, [user, topic]);

  return permissions;
};
