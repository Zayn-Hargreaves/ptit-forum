import { useAuth } from "@shared/providers/auth-provider";
import { Topic } from "@entities/topic/model/types";
import { useMemo } from "react";

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
    const isAdmin = user.role === "ADMIN";

    // 2. Check if user is Creator
    const isCreator = topic.createdBy === user.id || topic.canManageTopic === true; // Assuming topic.createdBy is the ID.

    // 3. Manager check (complex without list, relying on backend flag or simple creator/admin first)
    // If backend provides `canManageTopic` (which we added to interface), use it.
    const canManage = topic.canManageTopic || isAdmin || isCreator;

    return {
      canManage,
      isCreator,
      isMember: true, // Placeholder, actual check might need api call or topic.isJoined flag
    };
  }, [user, topic]);

  return permissions;
};
