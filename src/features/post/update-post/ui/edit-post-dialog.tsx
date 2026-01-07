'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog/dialog';
import { PostForm } from '../../create-post/ui/post-form';
import { IPost } from '@entities/post/model/types';

interface EditPostDialogProps {
  post: IPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPostDialog({ post, open, onOpenChange }: Readonly<EditPostDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl flex flex-col p-0 gap-0 max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <PostForm mode="edit" initialData={post} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
