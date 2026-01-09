'use client';

import { Card, CardContent } from '@shared/ui/card/card';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronDown, ChevronUp, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useUserComments } from '../api/use-user-comments';

interface UserCommentListProps {
  userId: string;
}

// const MAX_HEIGHT = 150; // Max height in pixels before truncation

export function UserCommentList({ userId }: UserCommentListProps) {
  const { data, isLoading } = useUserComments(userId);
  const comments = data?.data || [];

  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">Đang tải bình luận...</div>;
  }

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-6 text-center">
          <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>Người dùng chưa có bình luận nào hiển thị</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommentItem({ comment }: { comment: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <div className="text-muted-foreground text-sm">
            <span className="text-foreground font-semibold">{comment.author.fullName}</span> đã bình
            luận
            <span className="mx-2">•</span>
            {formatDistanceToNow(new Date(comment.createdDateTime), {
              addSuffix: true,
              locale: vi,
            })}
          </div>
          {comment.reactionCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <ThumbsUp className="h-4 w-4" />
              <span>{comment.reactionCount}</span>
            </div>
          )}
        </div>

        <div className="relative mb-3">
          <div
            className={`prose prose-sm dark:prose-invert max-w-none overflow-hidden transition-all duration-300 ${
              isExpanded ? '' : 'max-h-[150px]'
            }`}
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          {/* We strictly don't know text height without Ref, but CSS masking is a good heuristic */}
          {!isExpanded && (comment.content.length > 300 || comment.content.includes('<img')) && (
            <div className="from-background/10 to-background absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-b" />
          )}
        </div>

        {(comment.content.length > 300 || comment.content.includes('<img')) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 mb-3 flex items-center text-sm font-medium"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </button>
        )}

        <div className="bg-muted/50 rounded-md p-3 text-sm">
          <Link
            href={`/posts/${comment.postId}`}
            className="text-primary font-medium hover:underline"
          >
            Xem tại bài viết gốc
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
