// features/admin/topics/ui/topic-detail-sheet.tsx
'use client';

import { Avatar, AvatarFallback, Badge, Button, Separator } from '@shared/ui';
import { format } from 'date-fns';
import { Calendar, ExternalLink, Eye, Folder, MessageSquare, User } from 'lucide-react';
import Link from 'next/link'; // Nếu muốn link ra trang bài viết gốc

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet/sheet';

import { useTopicStore } from '../model/topic-store';

// Map hiển thị Visibility (dùng lại hoặc import từ constants)
const VISIBILITY_LABEL: Record<string, string> = {
  PUBLIC: 'Công khai',
  PRIVATE: 'Riêng tư',
  FACULTY: 'Theo khoa',
};

export function TopicDetailSheet() {
  const { selectedTopic, isOpenDetail, close } = useTopicStore();

  if (!selectedTopic) return null;

  return (
    <Sheet open={isOpenDetail} onOpenChange={(open) => !open && close()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <SheetTitle className="text-xl leading-normal font-bold">
              {selectedTopic.title}
            </SheetTitle>
            <Badge variant={selectedTopic.isDeleted ? 'destructive' : 'outline'}>
              {selectedTopic.isDeleted ? 'Đã xóa' : 'Hoạt động'}
            </Badge>
          </div>

          {/* Metadata Header */}
          <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Folder className="h-4 w-4" />
              <span>{selectedTopic.categoryName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {selectedTopic.createdAt
                  ? format(new Date(selectedTopic.createdAt), 'dd/MM/yyyy HH:mm')
                  : '-'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                {VISIBILITY_LABEL[selectedTopic.topicVisibility] || selectedTopic.topicVisibility}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Author Info */}
          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
            <Avatar className="h-10 w-10">
              {/* Nếu có avatarUrl trong topic response */}
              {/* <AvatarImage src={selectedTopic.authorAvatar} /> */}
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-foreground text-sm font-medium">
                {/* Giả sử response có field createdBy hoặc authorName */}
                {selectedTopic.createdBy || 'Người dùng ẩn danh'}
              </p>
              <p className="text-muted-foreground text-xs">Tác giả</p>
            </div>
          </div>

          <Separator />

          {/* Content Body */}
          <div className="space-y-2">
            <h4 className="text-foreground text-sm font-semibold">Nội dung bài viết</h4>
            <div className="bg-background min-h-[150px] rounded-md border p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {/* Nếu content là HTML thì dùng dangerouslySetInnerHTML, nếu plain text thì để trần */}
              {selectedTopic.content || '(Không có nội dung)'}
            </div>
          </div>

          {/* Statistics (Nếu API có trả về) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-4">
              <Eye className="mb-2 h-5 w-5 text-blue-500" />
              <span className="text-lg font-bold">120</span>{' '}
              {/* Thay bằng field viewCount thực tế */}
              <span className="text-muted-foreground text-xs">Lượt xem</span>
            </div>
            <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-4">
              <MessageSquare className="mb-2 h-5 w-5 text-green-500" />
              <span className="text-lg font-bold">15</span>{' '}
              {/* Thay bằng field commentCount thực tế */}
              <span className="text-muted-foreground text-xs">Bình luận</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={close}>
              Đóng
            </Button>
            <Button variant="default" asChild>
              <Link href={`/forum/topics/${selectedTopic.id}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem trên Diễn đàn
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
