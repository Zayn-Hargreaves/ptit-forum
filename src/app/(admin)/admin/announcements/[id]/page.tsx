'use client';

import { announcementApi } from '@shared/api/announcement.service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/ui/alert-dialog/alert-dialog';
import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, Edit, Send, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ANNOUNCEMENT_TYPE_LABEL, AnnouncementResponse } from '@/entities/announcement/model/types';
import { useAnnouncementStore } from '@/features/admin/announcements/model/announcement-store';
import { AnnouncementFormSheet } from '@/features/admin/announcements/ui/announcement-form-sheet';
import { ReleaseDialog } from '@/features/admin/announcements/ui/release-dialog';
import { formatDate } from '@/shared/lib/utils';

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openEdit, openRelease } = useAnnouncementStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: announcement, isLoading } = useQuery({
    queryKey: ['announcement', id],
    queryFn: () => announcementApi.getDetail(id as string),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (announcementId: string) => announcementApi.delete(announcementId),
    onSuccess: () => {
      toast.success('Xóa thông báo thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      router.push('/admin/announcements');
    },
    onError: (error) => {
      toast.error('Xóa thất bại');
      console.error(error);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!announcement) return <div>Not found</div>;

  const handleEdit = () => {
    const mappedAnnouncement: AnnouncementResponse = {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      announcementType: announcement.announcementType,
      announcementStatus: announcement.announcementStatus,
      createdBy: announcement.createdByFullName || '',
      createdDate: announcement.createdDate,
      modifiedBy: '',
      modifiedDate: announcement.modifiedDate || '',
    };
    openEdit(mappedAnnouncement);
  };

  const handleRelease = () => {
    const mappedAnnouncement: AnnouncementResponse = {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      announcementType: announcement.announcementType,
      announcementStatus: announcement.announcementStatus,
      createdBy: announcement.createdByFullName || '',
      createdDate: announcement.createdDate,
      modifiedBy: '',
      modifiedDate: announcement.modifiedDate || '',
    };
    openRelease(mappedAnnouncement);
  };

  const handleDelete = () => {
    if (announcement.id) {
      deleteMutation.mutate(announcement.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết thông báo</h1>
        </div>
        <div className="flex gap-2">
          {!announcement.announcementStatus && (
            <Button onClick={handleRelease} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Phát hành
            </Button>
          )}
          <Button onClick={handleEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Xóa
          </Button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{announcement.title}</CardTitle>
              <div className="mt-2 flex gap-2">
                <Badge>{ANNOUNCEMENT_TYPE_LABEL[announcement.announcementType]}</Badge>
                <Badge variant={announcement.announcementStatus ? 'default' : 'secondary'}>
                  {announcement.announcementStatus ? 'Đã phát hành' : 'Bản nháp'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Meta Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Người tạo</p>
                <p className="text-muted-foreground">{announcement.createdByFullName}</p>
              </div>
              <div>
                <p className="font-medium">Ngày tạo</p>
                <p className="text-muted-foreground">{formatDate(announcement.createdDate)}</p>
              </div>
              {announcement.modifiedDate && (
                <div>
                  <p className="font-medium">Cập nhật lần cuối</p>
                  <p className="text-muted-foreground">{formatDate(announcement.modifiedDate)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tài liệu đính kèm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {announcement.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="mr-2 flex-1 truncate" title={file.fileName}>
                      {file.fileName}
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AnnouncementFormSheet />
      <ReleaseDialog />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Thông báo này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
