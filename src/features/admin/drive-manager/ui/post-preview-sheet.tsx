import DOMPurify from 'isomorphic-dompurify';
import { memo } from 'react';

import { Checkbox } from '@/shared/ui/checkbox/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet/sheet';

import { PostAcceptedResponse } from '../model/schema';
import { useSelectionStore } from '../model/use-selection-store';

interface PostPreviewSheetProps {
  post: PostAcceptedResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const CommentReviewRow = memo(
  ({
    comment,
    postId,
    allCommentIds,
  }: {
    comment: { commentId: string; content: string; authorName?: string | null };
    postId: string;
    allCommentIds: string[];
  }) => {
    const store = useSelectionStore();
    const isSelected = store.hasId(comment.commentId);

    // Sanitize comment content too, just in case
    const cleanContent = DOMPurify.sanitize(comment.content);

    return (
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => store.toggleComment(comment.commentId, postId, allCommentIds)}
          className="mt-1"
        />
        <div className="flex-1 space-y-1">
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
          <div className="text-muted-foreground text-xs">
            Author: {comment.authorName || 'Unknown'}
          </div>
        </div>
      </div>
    );
  },
);
CommentReviewRow.displayName = 'CommentReviewRow';

export const PostPreviewSheet = ({ post, isOpen, onClose }: PostPreviewSheetProps) => {
  if (!post) return null;

  const cleanContent = DOMPurify.sanitize(post.content);
  const commentIds = post.comments.map((c) => c.commentId);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[800px] overflow-y-auto p-4 sm:max-w-[100%]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">{post.title}</SheetTitle>
          <SheetDescription>Author: {post.authorName || 'Unknown'}</SheetDescription>
        </SheetHeader>

        {/* --- POST CONTENT --- */}
        <div className="mb-8">
          <h3 className="text-muted-foreground mb-2 text-sm font-semibold uppercase">
            Post Content
          </h3>
          <div
            className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-4"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </div>

        {/* --- COMMENT LIST --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-semibold uppercase">
              Comments ({post.comments.length})
            </h3>
          </div>

          <div className="space-y-3">
            {post.comments.length === 0 ? (
              <div className="text-muted-foreground text-sm italic">No comments to review.</div>
            ) : (
              post.comments.map((comment) => (
                <CommentReviewRow
                  key={comment.commentId}
                  comment={comment}
                  postId={post.postId}
                  allCommentIds={commentIds}
                />
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
