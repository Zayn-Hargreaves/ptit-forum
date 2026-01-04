'use client';

import { useState } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@shared/ui/button/button';
import { LiteEditor } from '@shared/ui/editor/lite-editor';
import { useCreateComment } from '@features/comment/hooks/use-create-comment';

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
      }
    );
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <LiteEditor
        value={content}
        onChange={setContent}
        placeholder={placeholder || 'Viết bình luận...'}
        disabled={isPending}
        autoFocus={autoFocus}
        onSubmit={handleSubmit}
      />

      <div className="flex justify-end mt-2">
        <Button type="submit" disabled={isPending || !content.trim()} size="sm">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SendHorizonal className="h-4 w-4 mr-2" />}
          {isPending ? 'Đang gửi...' : 'Gửi'}
        </Button>
      </div>
    </form>
  );
}
