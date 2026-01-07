'use client';

import { IPost } from '@entities/post/model/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog/dialog';

import { PostForm } from '../../create-post/ui/post-form';

interface EditPostDialogProps {
  post: IPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPostDialog({ post, open, onOpenChange }: Readonly<EditPostDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <PostForm mode="edit" initialData={post} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
