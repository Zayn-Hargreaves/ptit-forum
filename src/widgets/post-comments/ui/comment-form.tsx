'use client';

import { useMe } from '@entities/session/model/queries';
import { useCreateComment } from '@features/comment/hooks/use-create-comment';
import { Button } from '@shared/ui/button/button';
import { LiteEditor } from '@shared/ui/editor/lite-editor';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { Loader2, SendHorizonal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CommentFormProps {
  postId: string;

  parentId?: string | null;

  rootCommentId?: string | null;

  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  postId,
  parentId = null,
  rootCommentId = null,
  onSuccess,
  placeholder,
  autoFocus = false,
}: Readonly<CommentFormProps>) {
  const [content, setContent] = useState('');
  const { data: me } = useMe();

  const { mutate, isPending } = useCreateComment({
    postId,
    rootCommentId,
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!content.trim() || isPending) return;

    mutate(
      {
        postId,
        content,
        parentId,
      },
      {
        onSuccess: () => {
          setContent('');
          toast.success('Bình luận đã được gửi thành công');
          onSuccess?.();
        },
        onError: () => {
          toast.error('Không thể gửi bình luận. Vui lòng thử lại.');
        },
      },
    );
  };

  const currentAvatar = me?.avatarUrl;

  return (
    <div className="mt-4 flex gap-3">
      <UserAvatar name={me?.fullName} avatarUrl={currentAvatar} className="mt-1 h-8 w-8" />

      <div className="flex-1">
        <form onSubmit={handleSubmit}>
          <LiteEditor
            value={content}
            onChange={setContent}
            placeholder={placeholder || 'Viết bình luận...'}
            disabled={isPending}
            autoFocus={autoFocus}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={isPending || !content.trim()} size="sm">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="mr-2 h-4 w-4" />
              )}
              {isPending ? 'Đang gửi...' : 'Gửi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
