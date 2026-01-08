import { commentApi } from '@entities/interaction/api/comment-api';
import { Comment } from '@entities/interaction/model/types';
import { Post } from '@entities/post/model/types';
import { useMe } from '@entities/session/model/queries';
import { PageResponse } from '@shared/api/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCreateCommentProps {
  postId: string;
  rootCommentId?: string | null;
}

export function useCreateComment({ postId, rootCommentId }: UseCreateCommentProps) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  const queryKey = rootCommentId
    ? ['comments', 'replies', rootCommentId]
    : ['comments', 'roots', postId];

  const postKey = ['post', postId];

  return useMutation({
    mutationFn: commentApi.create,

    onMutate: async (newCommentPayload) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      const previousPostData = queryClient.getQueryData(postKey);

      const tempId = `temp-${Date.now()}`;
      const mockComment: Comment = {
        id: tempId,
        content: newCommentPayload.content,
        postId,
        createdDateTime: new Date().toISOString(),
        deleted: false,
        rootCommentId: rootCommentId || null,
        replyToUser: null,
        author: {
          id: me?.id || 'temp-user',
          fullName: me?.fullName || me?.email || 'Tôi',
          avatarUrl: me?.avatarUrl || '',
        },

        isLiked: false,
        permissions: { canEdit: true, canDelete: true, canReport: false },
        parentId: newCommentPayload.parentId || null,
        reactionCount: 0,
      };

      queryClient.setQueryData<InfiniteData<PageResponse<Comment>>>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const isRoot = !rootCommentId;
        const firstPage = oldData.pages[0];
        const lastPage = oldData.pages.at(-1);

        if (isRoot) {
          const newPages = [...oldData.pages];
          newPages[0] = {
            ...firstPage,
            content: [mockComment, ...firstPage.content],
            totalElements: firstPage.totalElements + 1,
          };
          return { ...oldData, pages: newPages };
        } else {
          if (!lastPage) return oldData;
          const newPages = [...oldData.pages];
          const lastIndex = newPages.length - 1;
          newPages[lastIndex] = {
            ...lastPage,
            content: [...lastPage.content, mockComment],
            totalElements: lastPage.totalElements + 1,
          };
          return { ...oldData, pages: newPages };
        }
      });

      queryClient.setQueryData(postKey, (oldPost: Post | undefined) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          stats: {
            ...oldPost.stats,
            commentCount: (oldPost.stats?.commentCount ?? 0) + 1,
            viewCount: oldPost.stats?.viewCount ?? 0,
            likeCount: oldPost.stats?.likeCount ?? 0,
          },
        };
      });

      return { previousData, previousPostData };
    },

    onError: (err, newComment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      if (context?.previousPostData) {
        queryClient.setQueryData(postKey, context.previousPostData);
      }
      toast.error('Gửi bình luận thất bại');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: postKey });
    },
  });
}
