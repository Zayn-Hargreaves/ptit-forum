import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { commentApi } from '@entities/interaction/api/comment-api';
import { Comment } from '@entities/interaction/model/types';
import { PageResponse } from '@shared/api/types';
import { toast } from 'sonner';

interface UseDeleteCommentProps {
  postId: string;
  rootCommentId?: string | null;
}

export function useDeleteComment({ postId, rootCommentId }: UseDeleteCommentProps) {
  const queryClient = useQueryClient();

  const queryKey = rootCommentId ? ['comments', 'replies', rootCommentId] : ['comments', 'roots', postId];

  const updateQueryData = (oldData: InfiniteData<PageResponse<Comment>> | undefined, commentId: string) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => {
        const originalLength = page.content.length;
        const filteredContent = page.content.filter((c) => c.id !== commentId);
        const wasRemoved = originalLength > filteredContent.length;

        return {
          ...page,
          content: filteredContent,
          totalElements: wasRemoved ? page.totalElements - 1 : page.totalElements,
        };
      }),
    };
  };

  return useMutation({
    mutationFn: commentApi.delete,

    onMutate: async (commentIdToDelete) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<InfiniteData<PageResponse<Comment>>>(queryKey);

      queryClient.setQueryData<InfiniteData<PageResponse<Comment>>>(queryKey, (oldData) =>
        updateQueryData(oldData, commentIdToDelete)
      );

      return { previousData };
    },

    onError: (err, newComment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error('Lỗi xóa bình luận, đã khôi phục lại.');
    },

    onSuccess: () => {
      toast.success('Đã xóa bình luận');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
