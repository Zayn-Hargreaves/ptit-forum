import { cn } from '@shared/lib/utils';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

import { IComment } from '../model/types';
import { useToggleCommentLike } from '../model/use-comment-mutations';
import { CommentInput } from './comment-input';

interface CommentItemProps {
  comment: IComment;
  postId: string;
  replyingToId?: string | null;
  onReply?: (id: string | null) => void;
}

export function CommentItem({ comment, postId, replyingToId, onReply }: CommentItemProps) {
  const isReplying = replyingToId === comment.id;
  // const _inputRef = useRef<HTMLTextAreaElement>(null); // Assuming LiteEditor exposes ref or we wrap it

  // Like Hook
  const { mutate: toggleLike } = useToggleCommentLike({
    postId: postId,
  });

  const authorName = comment.author.fullName || 'Người dùng ẩn danh';
  return (
    <div className="flex flex-col gap-2">
      <div className="group flex gap-3">
        <UserAvatar name={authorName} avatarUrl={comment.author.avatar} className="h-8 w-8" />

        <div className="flex-1 space-y-1">
          <div className="bg-muted/50 inline-block rounded-2xl px-3 py-2 text-sm">
            <span className="mb-0.5 block text-xs font-semibold">{authorName}</span>
            <div
              className="text-foreground/90 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          </div>
          <div className="text-muted-foreground flex items-center gap-4 px-2 text-xs font-medium">
            <span>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
            </span>

            <button
              onClick={() => toggleLike(comment)}
              className={cn(
                'flex items-center gap-1 hover:underline',
                comment.isLiked ? 'font-bold text-red-500' : '',
              )}
            >
              {comment.isLiked ? 'Đã thích' : 'Thích'}
              {(comment.reactionCount || 0) > 0 && <span>({comment.reactionCount})</span>}
            </button>

            {onReply && (
              <button
                onClick={() => onReply(isReplying ? null : comment.id)}
                className="hover:underline"
              >
                Phản hồi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input */}
      {isReplying && (
        <div className="mt-1 ml-11">
          <CommentInput
            postId={postId}
            parentId={comment.id}
            initialContent={`<p>@${comment.author.fullName}&nbsp;</p>`}
            onCancel={() => onReply && onReply(null)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
