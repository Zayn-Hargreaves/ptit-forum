import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { commentApi } from '../api/comment-api';
import { reactionApi } from '@entities/interaction/api/reaction-api';
import { TargetType } from '@entities/interaction/model/types';
import { IComment } from './types';
import { useMe } from '@entities/session/model/queries';

interface UseCreateCommentProps {
  postId: string;
  onSuccess?: () => void;
}

export function useCreateComment({ postId, onSuccess }: UseCreateCommentProps) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const queryKey = ['comments', postId];

  return useMutation({
    mutationFn: (variables: { content: string; parentId?: string }) => 
      commentApi.createComment(postId, variables.content, variables.parentId),
    
    onMutate: async (newCommentVariables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData<IComment[]>(queryKey) || [];

      if (me) {
        // --- 1. RESOLVE CORRECT PARENT ID (FLATTEN DEEP REPLIES) ---
        // We only show 2 levels: Root -> Replies.
        // If replying to a Reply, we must attach the new comment to the Root of that Reply.
        let effectiveParentId = newCommentVariables.parentId || null;
        let effectiveRootId = effectiveParentId;

        if (effectiveParentId) {
            const parentComment = previousComments.find(c => c.id === effectiveParentId);
            if (parentComment?.parentId) {
                // Parent is already a reply, so valid root is its parent
                effectiveParentId = parentComment.parentId; 
                // (Note: effectiveParentId for the API might still need to be the specific reply ID if the backend supports trees,
                // but for VISUAL rendering in 'CommentSection', we need it to be the Root ID)
            }
        }

        const optimisticComment: IComment = {
          id: `temp-${Date.now()}`,
          content: newCommentVariables.content,
          author: {
            id: me.id,
            fullName: me.fullName,
            avatar: me.avatarUrl || '',
          },
          createdAt: new Date().toISOString(),
          replyCount: 0,
          reactionCount: 0,
          isLiked: false,
          postId: postId,
          // Use the resolved parentId so it appears in the right group
          parentId: effectiveParentId, 
        };

        queryClient.setQueryData<IComment[]>(queryKey, (old) => {
          if (!old) return [optimisticComment];

          // --- 2. SMART FLAT INSERTION ---
          // Goal: Insert 'optimisticComment' visually "at the end" of its group.
          
          // Case A: Root Comment -> Insert at top (or bottom preference?)
          // Usually new roots go to top (Newest First) or bottom (Oldest First).
          // If we follow 'append' logic (Oldest First):
          if (!optimisticComment.parentId) {
             return [...old, optimisticComment]; 
          }

          // Case B: Reply -> Insert after the parent or the last sibling
          // Find the index of the parent (or the root grouping)
          const parentIndex = old.findIndex(c => c.id === optimisticComment.parentId);
          
          if (parentIndex !== -1) {
             // We want to insert AFTER the parent and ALL its current replies to maintain chronological order
             // Scan forward from parentIndex to find the last comment that also has this parentId
             let insertIndex = parentIndex;
             
             for (let i = parentIndex + 1; i < old.length; i++) {
                 if (old[i].parentId === optimisticComment.parentId) {
                     insertIndex = i;
                 } else {
                     // Found a comment that belongs to a different thread or is a new root
                     // Assuming the list is grouped. If mixed, this loop just finds the last 'sibling' seen so far.
                     // But strictly speaking, if we just want to allow it to be rendered, 
                     // putting it right after the parent (parentIndex + 1) is "Newest First" for replies (if iterated).
                     // But the rendering uses .filter(). 
                     // So physical position in array only matters for the .map() order OF THE FILTERED LIST.
                     // Appending to the END of the array guarantees it's the LAST item in .filter(...), i.e., Bottom.
                 }
             }

             // Actually, if we just append to the end of the array, map() will iterate it last.
             // This results in "Bottom of the reply list" behavior, which is correct for threads.
             // The User complained about "Code Smell" of appending to root. 
             // To satisfy the "Insert in Tree" mental model for a Flat List, we insert after the last sibling.
             
             // Simple approach: Insert after parent (Top of replies).
             // const newComments = [...old];
             // newComments.splice(parentIndex + 1, 0, optimisticComment);
             // return newComments;

             // BETTER APPROACH: Just append to end, but explain why.
             // BUT user explicitly asked for "Method 3". 
             // "Method 3" code: newComments.splice(parentIndex + 1, 0, optimisticComment);
             // This puts it at the TOP of the replies. 
             // Let's stick effectively to what the user logic implies for Flat List Structure.
             
             // However, to keep it SAFE and ensure it renders LAST (chronological), 
             // we should finding index of *next root* and insert before that? Too complex.
             
             // Let's implement EXACTLY what the user suggested for "Flat List" (Insert after Parent),
             // acknowledging it might change the sort order to "Newest on Top" for that specific pending comment.
             const newComments = [...old];
             newComments.splice(parentIndex + 1, 0, optimisticComment);
             return newComments;
          }

          // Fallback if parent not found
          return [...old, optimisticComment];
        });
      }

      return { previousComments };
    },

    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
      toast.error('Gửi bình luận thất bại');
    },

    onSuccess: (data, variables) => {
        // Replace temp comment with real one or just invalidate
        // Invalidating is safer to ensure consistency
        queryClient.invalidateQueries({ queryKey });
        toast.success(variables.parentId ? 'Đã phản hồi' : 'Đã gửi bình luận');
        if (onSuccess) onSuccess();
    }
  });
}

interface UseToggleCommentLikeProps {
  postId: string;
}

export function useToggleCommentLike({ postId }: UseToggleCommentLikeProps) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const queryKey = ['comments', postId];

  return useMutation({
    mutationFn: (comment: IComment) => 
      reactionApi.toggle({
        targetId: comment.id,
        targetType: TargetType.COMMENT,
        reactionType: 'LIKE'
      }),

    onMutate: async (targetComment) => {
      // Check auth if needed, though usually handled by wrapper or component checking `me`
      if (!me) {
          toast.error('Vui lòng đăng nhập');
          throw new Error('UNAUTHORIZED');
      }

      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData<IComment[]>(queryKey);

      queryClient.setQueryData<IComment[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map(c => {
          if (c.id === targetComment.id) {
            // If currently liked, we are unliking (-1). If not liked, we are liking (+1).
            // NOTE: The 'targetComment' passed here might be STALE if clicked rapidly.
            // We should use the 'c.isLiked' from the cache (the 'old' state) to toggle.
            const isCurrentlyLiked = !!c.isLiked;
            return {
              ...c,
              isLiked: !isCurrentlyLiked,
              reactionCount: (c.reactionCount || 0) + (isCurrentlyLiked ? -1 : 1)
            };
          }
          return c;
        });
      });

      return { previousComments };
    },

    onError: (err, variables, context) => {
      if (err.message === 'UNAUTHORIZED') return;
      
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
      toast.error('Không thể thả tim');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
}
