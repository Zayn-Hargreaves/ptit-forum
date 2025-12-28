"use client";

import * as React from "react";
import { PenLine } from "lucide-react";
import { useIsMobile } from "@shared/hooks/use-mobile";

import { Button } from "@shared/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/dialog/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@shared/ui/drawer/drawer";
import { CreatePostForm } from "./create-post-form";

export function CreatePostDialog() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    setOpen(false);
  };

  const TriggerButton = (
    <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
      <PenLine className="h-4 w-4" />
      Tạo bài viết
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Tạo bài viết mới</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <CreatePostForm onSuccess={handleSuccess} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      <DialogContent
        className="w-full 
        h-dvh          
        sm:h-[90vh]        
        sm:max-w-[90vw]    
        md:max-w-[1000px]   
        flex flex-col p-0 gap-0"
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <CreatePostForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
