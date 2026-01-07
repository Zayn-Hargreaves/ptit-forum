'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@shared/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@shared/ui/drawer/drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { CreatePostForm } from './create-post-form';
import { sessionApi } from '@entities/session/api/session-api';

interface CreatePostDialogProps {
  topicId: string;
}

export function CreatePostDialog({ topicId }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch current user profile
  const { data: user } = useQuery({
    queryKey: ['session', 'profile'],
    queryFn: sessionApi.getProfile
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const TriggerButton = (
    <div className="bg-card border rounded-xl p-4 mb-6 cursor-pointer hover:bg-accent/50 transition-colors flex gap-4 items-center shadow-sm">
      <Avatar className="h-10 w-10">
        {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
        <AvatarFallback>{user ? getInitials(user.fullName) : 'ME'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-muted/50 rounded-full h-10 flex items-center px-4 text-muted-foreground text-sm">
        Bạn đang nghĩ gì?
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {TriggerButton}
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tạo bài viết thảo luận</DialogTitle>
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
      <DrawerTrigger asChild>
        {TriggerButton}
      </DrawerTrigger>
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
