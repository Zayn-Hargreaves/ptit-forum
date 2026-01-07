import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reactionApi } from '@entities/interaction/api/reaction-api';
import { TargetType } from '@entities/interaction/model/types';
import { useMe } from '@entities/session/model/queries';

interface UseReactionProps {
  targetId: string;
  targetType: TargetType;
  currentIsLiked: boolean;
  currentCount: number;
  queryKey: any[];
}

export const useReaction = ({
  targetId,
  targetType,
  currentIsLiked,
  currentCount,
  queryKey,
}: UseReactionProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useMe();

  return useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error('UNAUTHORIZED');
      }
      return await reactionApi.toggle({
        targetId,
        targetType,
        reactionType: 'LIKE',
      });
    },

    onMutate: async () => {
      if (!session) {
        toast.error('Vui lòng đăng nhập để thực hiện chức năng này');
        return; // Don't proceed with optimistic update if not logged in
      }

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;

        // Helper to update a single item (Post/Comment)
        const updateItem = (item: any) => {
          if (item.id === targetId) {
            const newCount = currentIsLiked
                ? Math.max(0, currentCount - 1)
                : currentCount + 1;
            
            return {
              ...item,
              isLiked: !currentIsLiked,
              reactionCount: newCount, // For Comments / General
              likeCount: newCount,     // For Posts
              stats: item.stats ? {
                  ...item.stats,
                  likes: newCount,
                  // Keep other stats if they exist
              } : undefined
            };
          }
          return item;
        };

        // Case 0: Direct Array (e.g. getComments returns IComment[])
        if (Array.isArray(oldData)) {
            return oldData.map(updateItem);
        }

        // Case 1: Single item (DetailPostResponse / DetailCommentResponse)
        if (oldData.id === targetId) {
          return updateItem(oldData);
        }

        // Case 2: Paged list (Page<PostResponse> / Page<CommentResponse>)
        // Usually structure is { content: [...], ... } or { result: { content: [...] } }
        // If API returns `Page<T>`:
        if (oldData.content && Array.isArray(oldData.content)) {
          return {
            ...oldData,
            content: oldData.content.map(updateItem),
          };
        }
        
        // If API returns { result: { content: ... } } (Raw ApiResponse)
        if (oldData.result?.content && Array.isArray(oldData.result.content)) {
             return {
                ...oldData,
                result: {
                    ...oldData.result,
                    content: oldData.result.content.map(updateItem)
                }
             }
        }

        return oldData;
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },

    onError: (err, newTodo, context) => {
      if (err.message === 'UNAUTHORIZED') {
         // Toast already handled or handle here
         return;
      }
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error('Không thể thả tim, vui lòng thử lại!');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
