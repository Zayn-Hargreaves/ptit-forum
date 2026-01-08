'use client';

import { IPost } from '@entities/post/model/types';
import { useIsMobile } from '@shared/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@shared/ui/drawer/drawer';
import * as React from 'react';

import { PostForm } from '../../create-post/ui/post-form';

interface EditPostDialogProps {
  post: IPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPostDialog({ post, open, onOpenChange }: Readonly<EditPostDialogProps>) {
  const isMobile = useIsMobile();
  const [popoverContainer, setPopoverContainer] = React.useState<HTMLDivElement | null>(null);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Chỉnh sửa bài viết</DrawerTitle>
          </DrawerHeader>

          <div ref={setPopoverContainer} className="overflow-y-auto px-4 pb-4">
            <PostForm
              mode="edit"
              initialData={post}
              onSuccess={handleSuccess}
              popoverContainer={popoverContainer}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-dvh w-full flex-col gap-0 p-0 sm:h-[90vh] sm:max-w-[95vw] lg:max-w-[85vw]">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>

        <div ref={setPopoverContainer} className="flex-1 overflow-y-auto px-6 py-4">
          <PostForm
            mode="edit"
            initialData={post}
            onSuccess={handleSuccess}
            popoverContainer={popoverContainer}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
