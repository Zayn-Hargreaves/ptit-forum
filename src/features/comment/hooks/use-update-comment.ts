import { commentApi } from '@entities/interaction/api/comment-api';
import { Comment } from '@entities/interaction/model/types';
import { PageResponse } from '@shared/api/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUpdateCommentProps {
  rootCommentId?: string | null;
  postId: string;
}

export function useUpdateComment({ rootCommentId, postId }: UseUpdateCommentProps) {
  const queryClient = useQueryClient();
  const queryKey = rootCommentId
    ? ['comments', 'replies', rootCommentId]
    : ['comments', 'roots', postId];

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentApi.update(commentId, { content }),
    onMutate: async ({ commentId, content: newContent }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      const updateCommentInPages = (
        pages: PageResponse<Comment>[],
        commentId: string,
        newContent: string,
      ) => {
        const newPages = [];
        for (const page of pages) {
          const newContentArray = [];
          for (const c of page.content) {
            if (c.id === commentId) {
              newContentArray.push({ ...c, content: newContent });
            } else {
              newContentArray.push(c);
            }
          }
          newPages.push({ ...page, content: newContentArray });
        }
        return newPages;
      };

      queryClient.setQueryData<InfiniteData<PageResponse<Comment>>>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: updateCommentInPages(oldData.pages, commentId, newContent),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error('Không thể chỉnh sửa bình luận');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
