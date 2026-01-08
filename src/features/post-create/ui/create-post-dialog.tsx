'use client';

import { sessionApi } from '@entities/session/api/session-api';
import { useMediaQuery } from '@shared/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/dialog/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@shared/ui/drawer/drawer';
import { UserAvatar } from '@shared/ui/user-avatar/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { CreatePostForm } from './create-post-form';

interface CreatePostDialogProps {
  topicId: string;
}

export function CreatePostDialog({ topicId }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Fetch current user profile
  const { data: user } = useQuery({
    queryKey: ['session', 'profile'],
    queryFn: sessionApi.getProfile,
  });

  const TriggerButton = (
    <div className="bg-card hover:bg-accent/50 mb-6 flex cursor-pointer items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors">
      <UserAvatar name={user?.fullName} avatarUrl={user?.avatarUrl} className="h-10 w-10" />
      <div className="bg-muted/50 text-muted-foreground flex h-10 flex-1 items-center rounded-full px-4 text-sm">
        Bạn đang nghĩ gì?
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tạo bài viết thảo luận</DialogTitle>
            <DialogDescription className="sr-only">
              Tạo bài viết mới trong chủ đề này
            </DialogDescription>
          </DialogHeader>
          <CreatePostForm
            topicId={topicId}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Tạo bài viết thảo luận</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <CreatePostForm
            topicId={topicId}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
