'use client';

import { useState } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@shared/ui/button/button';
import { LiteEditor } from '@shared/ui/editor/lite-editor';
import { useCreateComment } from '@features/comment/hooks/use-create-comment';
import { useMe } from '@entities/session/model/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';

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
      }
    );
  };

  const currentAvatar = me?.avatarUrl;
  const currentInitial = me?.fullName?.[0] || '?';

  return (
    <div className="flex gap-3 mt-4">
       <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={currentAvatar} />
          <AvatarFallback>{currentInitial}</AvatarFallback>
       </Avatar>
       
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

            <div className="flex justify-end mt-2">
                <Button type="submit" disabled={isPending || !content.trim()} size="sm">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SendHorizonal className="h-4 w-4 mr-2" />}
                {isPending ? 'Đang gửi...' : 'Gửi'}
                </Button>
            </div>
            </form>
       </div>
    </div>
  );
}
