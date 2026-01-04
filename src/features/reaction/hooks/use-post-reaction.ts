import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Post } from '@entities/post/model/types';
import { reactionApi } from '@entities/interaction/api/reaction-api';
import { TargetType } from '@entities/interaction/model/types';
import { PageResponse } from '@shared/api/types';

interface UsePostReactionProps {
  post: Post;
}

type PostListPage = PageResponse<Post>;

export function usePostReaction({ post }: UsePostReactionProps) {
  const queryClient = useQueryClient();

  const detailKey = ['post', post.id];

  const listKeyRoot = ['posts'];

  return useMutation({
    mutationFn: (type: 'LIKE') =>
      reactionApi.toggle({
        targetId: post.id,
        targetType: TargetType.POST,
        reactionType: type,
      }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: listKeyRoot });

      const previousDetail = queryClient.getQueryData<Post>(detailKey);

      const isLikedOld = post.userState?.liked ?? false;
      const newLikedState = !isLikedOld;
      const newReactionCount = (post.stats?.reactionCount || 0) + (newLikedState ? 1 : -1);

      const updatePostLogic = (oldPost: Post): Post => ({
        ...oldPost,
        userState: { ...oldPost.userState, liked: newLikedState },
        stats: { ...oldPost.stats, reactionCount: newReactionCount },
      });

      queryClient.setQueryData<Post>(detailKey, (old) => {
        if (!old) return undefined;
        return updatePostLogic(old);
      });

      queryClient.setQueriesData<InfiniteData<PostListPage>>({ queryKey: listKeyRoot }, (oldData) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((p) => {
              if (p.id === post.id) {
                return updatePostLogic(p);
              }
              return p;
            }),
          })),
        };
      });

      return { previousDetail };
    },

    onSuccess: (data) => {
      const syncRealData = (oldPost: Post): Post => {
        const userState = { ...oldPost.userState };
        const stats = { ...oldPost.stats };

        return {
          ...oldPost,
          userState: { ...userState, liked: data.reacted },
          stats: { ...stats, reactionCount: data.totalReactions },
        };
      };

      queryClient.setQueryData<Post>(detailKey, (old) => {
        if (!old) return old;
        return syncRealData(old);
      });

      queryClient.setQueriesData<InfiniteData<PostListPage>>({ queryKey: listKeyRoot }, (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((p) => {
              if (p.id === post.id) return syncRealData(p);
              return p;
            }),
          })),
        };
      });
    },

    onError: (err, variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(detailKey, context.previousDetail);
      }
      queryClient.invalidateQueries({ queryKey: listKeyRoot });

      toast.error('Không thể thả tim lúc này. Vui lòng thử lại sau.');
    },
  });
}
