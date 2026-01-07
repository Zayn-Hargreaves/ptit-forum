import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { IComment } from '../model/types';
import { useState, useRef, useEffect } from 'react';
import { CommentInput } from './comment-input';
import { useToggleCommentLike } from '../model/use-comment-mutations';
import { cn } from '@shared/lib/utils';
import { Heart } from 'lucide-react';

interface CommentItemProps {
  comment: IComment;
  postId: string;
  replyingToId?: string | null;
  onReply?: (id: string | null) => void;
}

export function CommentItem({ comment, postId, replyingToId, onReply }: CommentItemProps) {
  const isReplying = replyingToId === comment.id;
  const inputRef = useRef<HTMLTextAreaElement>(null); // Assuming LiteEditor exposes ref or we wrap it

  // Like Hook
  const { mutate: toggleLike } = useToggleCommentLike({
    postId: postId
  });

  return (
    <div className="flex flex-col gap-2">
       <div className="flex gap-3 group">
        <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar} /> 
            <AvatarFallback>{comment.author.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
            <div className="bg-muted/50 rounded-2xl px-3 py-2 text-sm inline-block">
                <span className="font-semibold block text-xs mb-0.5">{comment.author.fullName}</span>
                <div 
                className="text-foreground/90 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0" 
                dangerouslySetInnerHTML={{ __html: comment.content }} 
                />
            </div>
            <div className="flex items-center gap-4 px-2 text-xs text-muted-foreground font-medium">
                <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}</span>
                
                <button 
                    onClick={() => toggleLike(comment)}
                    className={cn(
                        "hover:underline flex items-center gap-1",
                        comment.isLiked ? "text-red-500 font-bold" : ""
                    )}
                >
                    {comment.isLiked ? "Đã thích" : "Thích"}
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
          <div className="ml-11 mt-1">
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
