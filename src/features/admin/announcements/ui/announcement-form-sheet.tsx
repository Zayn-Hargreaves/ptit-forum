'use client';

import { ANNOUNCEMENT_TYPE_LABEL, AnnouncementType } from '@entities/announcement/model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { announcementApi } from '@shared/api/announcement.service';
import { FileMetadata, useFileUpload } from '@shared/hooks/use-file-upload';
import { useMediaQuery } from '@shared/hooks/use-media-query';
import { Button } from '@shared/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@shared/ui/drawer/drawer';
import { GithubEditor } from '@shared/ui/editor/github-editor';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Input } from '@shared/ui/input/input';
import { ScrollArea } from '@shared/ui/scroll-area/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Paperclip, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAnnouncementStore } from '../model/announcement-store';
import { DraftAnnouncementFormValues, draftAnnouncementSchema } from '../model/schema';

export function AnnouncementFormSheet() {
  const { isOpenConfig, close, selectedAnnouncement } = useAnnouncementStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const isEdit = !!selectedAnnouncement;
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { upload, isUploading } = useFileUpload<FileMetadata>({
    validate: { maxSizeMB: 20 },
  });

  const form = useForm<DraftAnnouncementFormValues>({
    resolver: zodResolver(draftAnnouncementSchema),
    defaultValues: {
      title: '',
      content: '',
      announcementType: AnnouncementType.GENERAL,
      attachments: [],
    },
  });

  // Reset form when opening/closing or switching mode
  useEffect(() => {
    if (isOpenConfig) {
      if (selectedAnnouncement) {
        form.reset({
          title: selectedAnnouncement.title,
          content: selectedAnnouncement.content,
          announcementType: selectedAnnouncement.announcementType,
          attachments: [],
          existingAttachments: selectedAnnouncement.attachments || [],
        });
      } else {
        form.reset({
          title: '',
          content: '',
          announcementType: AnnouncementType.GENERAL,
          attachments: [],
          existingAttachments: [],
        });
      }
    }
  }, [isOpenConfig, selectedAnnouncement, form]);

  const mutation = useMutation({
    mutationFn: async (data: DraftAnnouncementFormValues) => {
      const fileMetadataIds: string[] = [];
      const files: File[] = data.attachments || [];

      // upload new files
      if (Array.isArray(files)) {
        for (const file of files) {
          const res = await upload(file, '/files/upload', 'POST', 'file', {
            resourceType: 'ANNOUNCEMENT',
          });
          if (res?.id) fileMetadataIds.push(res.id);
        }
      }

      // Add existing files
      if (data.existingAttachments && Array.isArray(data.existingAttachments)) {
        data.existingAttachments.forEach((file: ExistingAttachment) => {
          fileMetadataIds.push(file.id);
        });
      }

      if (isEdit && selectedAnnouncement) {
        return announcementApi.update(selectedAnnouncement.id, {
          title: data.title,
          content: data.content,
          announcementType: data.announcementType,
          announcementStatus: selectedAnnouncement.announcementStatus,
          // Targeting fields are NOT updated here to preserve existing targeting
          // or empty if not yet released.
          facultyIds: [],
          classCodes: [],
          schoolYearCodes: [],
          fileMetadataIds,
        });
      } else {
        return announcementApi.create({
          title: data.title,
          content: data.content,
          announcementType: data.announcementType,
          isGlobal: false, // Defaulting to false as targeting is done in Release step
          targetFaculties: [],
          targetCohorts: [],
          specificClassCodes: [],
          fileMetadataIds,
        });
      }
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Cập nhật thành công' : 'Tạo bản nháp thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      close();

      // UX: Redirect to detail page immediately after creation/update
      if (data?.id) {
        router.push(`/admin/announcements/${data.id}`);
      }
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    },
  });

  const onSubmit = (data: DraftAnnouncementFormValues) => {
    mutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentFiles = (form.getValues('attachments') as File[]) || [];
      form.setValue('attachments', [...currentFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const currentFiles = (form.getValues('attachments') as File[]) || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue('attachments', newFiles);
  };

  // Define interface for existing attachments
  interface ExistingAttachment {
    id: string;
    fileName?: string;
    name?: string;
  }

  const removeExistingFile = (index: number) => {
    const currentFiles = (form.getValues('existingAttachments') as ExistingAttachment[]) || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue('existingAttachments', newFiles);
  };

  const attachments = (form.watch('attachments') as File[]) || [];
  const existingAttachments = (form.watch('existingAttachments') as ExistingAttachment[]) || [];

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6 font-sans">
        <FormField
          control={form.control}
          name="announcementType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại thông báo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại thông báo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(ANNOUNCEMENT_TYPE_LABEL).map((type) => (
                    <SelectItem key={type} value={type}>
                      {ANNOUNCEMENT_TYPE_LABEL[type as AnnouncementType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề thông báo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <GithubEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attachments */}
        <div className="space-y-3">
          <FormLabel>Tài liệu đính kèm</FormLabel>
          <Input
            type="file"
            multiple
            className="cursor-pointer"
            onChange={handleFileChange}
            disabled={isUploading || mutation.isPending}
          />

          {/* Existing Attachments */}
          {existingAttachments.length > 0 && (
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm font-medium">Đã tải lên:</div>
              {existingAttachments.map((file, index) => (
                <div
                  key={`existing-${index}`}
                  className="bg-muted/50 flex items-center justify-between rounded-md p-2 text-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="text-muted-foreground h-4 w-4" />
                    <span className="max-w-[200px] truncate">{file.fileName || file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingFile(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              {existingAttachments.length > 0 && (
                <div className="text-muted-foreground mt-2 text-sm font-medium">Mới tải lên:</div>
              )}
              {attachments.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="bg-muted/50 flex items-center justify-between rounded-md p-2 text-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="text-muted-foreground h-4 w-4" />
                    <span className="max-w-[200px] truncate">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close} disabled={mutation.isPending}>
            Hủy
          </Button>
          <Button type="submit" disabled={mutation.isPending || isUploading}>
            {mutation.isPending || isUploading
              ? 'Đang xử lý...'
              : isEdit
                ? 'Cập nhật'
                : 'Tạo bản nháp'}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpenConfig} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Chỉnh sửa thông báo' : 'Tạo bản nháp thông báo'}</DialogTitle>
            <DialogDescription>
              Nhập tiêu đề và nội dung. Bạn sẽ chọn đối tượng gửi sau khi tạo xong.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpenConfig} onOpenChange={(open) => !open && close()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{isEdit ? 'Chỉnh sửa thông báo' : 'Tạo bản nháp thông báo'}</DrawerTitle>
          <DrawerDescription>
            Nhập tiêu đề và nội dung. Bạn sẽ chọn đối tượng gửi sau khi tạo xong.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[80vh] px-4">{content}</ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Hủy</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
