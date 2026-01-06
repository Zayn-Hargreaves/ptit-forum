'use client';

import { Comment, TargetType } from '@entities/interaction/model/types';
import { useMe } from '@entities/session/model/queries';
import { useUpdateComment } from '@features/comment/hooks/use-update-comment';
import { ReportDialog } from '@features/report/ui/report-dialog';
import { Button } from '@shared/ui/button/button';
import { LiteEditor } from '@shared/ui/editor/lite-editor';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import DOMPurify from 'isomorphic-dompurify';
import { Flag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { CommentForm } from './comment-form';
import { ReplyList } from './reply-list';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  isReply?: boolean;
  onDelete: (id: string) => void;
  onReplySuccess: () => void;
}

const stripHtml = (html: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } catch {
    return '';
  }
};

const truncateHtml = (html: string, maxLength: number) => {
  const text = stripHtml(html);
  if (text.length <= maxLength) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  let accumulatedLength = 0;
  let truncated = false;

  function walkNodes(node: Node, parent: Element): void {
    if (truncated) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent || '';
      const remainingLength = maxLength - accumulatedLength;
      if (accumulatedLength + textContent.length <= maxLength) {
        parent.appendChild(document.createTextNode(textContent));
        accumulatedLength += textContent.length;
      } else {
        const truncatedText = textContent.slice(0, remainingLength) + '...';
        parent.appendChild(document.createTextNode(truncatedText));
        accumulatedLength = maxLength;
        truncated = true;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const clonedElement = element.cloneNode(false) as Element;
      parent.appendChild(clonedElement);
      for (const child of Array.from(element.childNodes)) {
        walkNodes(child, clonedElement);
        if (truncated) break;
      }
    }
  }

  const resultContainer = document.createElement('div');
  for (const child of Array.from(body.childNodes)) {
    walkNodes(child, resultContainer);
    if (truncated) break;
  }
  return resultContainer.innerHTML;
};

export function CommentItem({
  comment,
  postId,
  isReply = false,
  onDelete,
  onReplySuccess,
}: Readonly<CommentItemProps>) {
  const { data: me } = useMe();

  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const effectiveRootId = isReply ? comment.rootCommentId : comment.id;

  const updateComment = useUpdateComment({
    rootCommentId: effectiveRootId,
    postId,
  });

  useEffect(() => {
    if (isEditing && !editContent) {
      setEditContent(comment.content || '');
    }
  }, [isEditing, comment.content, editContent]);

  const replyCount = comment.stats?.replyCount || 0;
  const hasChildren = !!comment.children?.length;
  const authorName = comment.author?.fullName || 'Ẩn danh';
  const avatarUrl = comment.author?.avatarUrl ?? '';
  const isOwner = !!me?.id && me.id === comment.author?.id;

  const canEdit = comment.permissions?.canEdit ?? isOwner;
  const canDelete = comment.permissions?.canDelete ?? isOwner;
  const canReport = comment.permissions?.canReport ?? !isOwner;

  // --- HTML HANDLING LOGIC ---
  const displayContent = useMemo(() => {
    const MAX_COMMENT_LENGTH = 300;
    const plainTextContent = stripHtml(comment.content || '');
    const isLong = plainTextContent.length > MAX_COMMENT_LENGTH;

    const rawContent =
      isLong && !isExpanded
        ? truncateHtml(comment.content || '', MAX_COMMENT_LENGTH)
        : comment.content || '';

    return DOMPurify.sanitize(rawContent);
  }, [comment.content, isExpanded]);

  const isLongComment = stripHtml(comment.content || '').length > 300;

  // --- RENDER ---

  if (comment.deleted) {
    return (
      <div className={isReply ? 'mt-2' : 'mt-4'}>
        <div className="text-muted-foreground bg-muted/20 rounded p-3 text-sm italic">
          Bình luận này đã bị xóa bởi tác giả.
        </div>
        {hasChildren && (
          <div className="mt-2 ml-12">
            {comment.children!.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                postId={postId}
                isReply
                onDelete={onDelete}
                onReplySuccess={onReplySuccess}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={isReply ? 'mt-2' : 'mt-4'}>
      <div className="flex items-start gap-3">
        <UserAvatar
          name={comment.author?.fullName}
          avatarUrl={avatarUrl}
          className="mt-1 h-8 w-8"
        />

        <div className="flex-1 space-y-1">
          {/* Content Block */}
          <div className="bg-muted/50 group rounded-lg rounded-tl-none p-3">
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-semibold">{authorName}</span>
              <span className="text-muted-foreground text-xs">
                {comment.createdDateTime &&
                  formatDistanceToNow(
                    new Date(
                      comment.createdDateTime.endsWith('Z')
                        ? comment.createdDateTime
                        : `${comment.createdDateTime}Z`,
                    ),
                    {
                      addSuffix: true,
                      locale: vi,
                    },
                  )}
              </span>
            </div>

            {isEditing ? (
              <LiteEditor
                value={editContent}
                onChange={setEditContent}
                placeholder="Chỉnh sửa bình luận..."
                disabled={updateComment.isPending}
              />
            ) : (
              <>
                <div
                  className="prose dark:prose-invert max-w-none text-sm break-words"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
                {isLongComment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground mt-1 h-auto p-0 text-xs"
                    onClick={() => setIsExpanded((v) => !v)}
                  >
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Actions Block */}
          {isEditing ? (
            <div className="flex gap-2 px-1">
              <Button
                size="sm"
                disabled={updateComment.isPending || !editContent.trim()}
                onClick={() =>
                  updateComment.mutate(
                    { commentId: comment.id, content: editContent },
                    {
                      onSuccess: () => {
                        setIsEditing(false);
                        toast.success('Đã cập nhật bình luận');
                      },
                    },
                  )
                }
              >
                Lưu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent('');
                }}
              >
                Hủy
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-1 text-xs select-none">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying((v) => !v)}
                className="text-muted-foreground hover:text-foreground h-6 px-2"
              >
                Trả lời
              </Button>

              {!isReply && replyCount > 0 && (
                <button
                  className="text-muted-foreground ml-1 font-semibold hover:underline"
                  onClick={() => setShowReplies((v) => !v)}
                >
                  {showReplies ? 'Ẩn phản hồi' : `Xem ${replyCount} phản hồi`}
                </button>
              )}

              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-6 px-2"
                  onClick={() => {
                    setEditContent('');
                    setIsEditing(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}

              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-6 px-2"
                  onClick={() => onDelete(comment.id)}
                >
                  Xóa
                </Button>
              )}

              {canReport && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground ml-auto h-6 px-2 hover:text-orange-600"
                  onClick={() => setIsReportOpen(true)}
                >
                  <Flag className="mr-1 h-3 w-3" />
                  Báo cáo
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reply form */}
      {isReplying && (
        <div className={isReply ? '' : 'ml-12'}>
          <CommentForm
            postId={postId}
            parentId={comment.id}
            rootCommentId={effectiveRootId}
            onSuccess={() => {
              setIsReplying(false);
              if (!isReply) setShowReplies(true); // Mở list reply nếu đang ở root
              onReplySuccess();
            }}
            placeholder={`Trả lời ${authorName}...`}
            autoFocus
          />
        </div>
      )}

      {!isReply && showReplies && <ReplyList rootCommentId={comment.id} postId={postId} />}

      <ReportDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        targetId={comment.id}
        targetType={TargetType.COMMENT}
      />
    </div>
  );
}
