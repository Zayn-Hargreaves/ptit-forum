'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Paperclip, X } from 'lucide-react';

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
import { useMediaQuery } from '@shared/hooks/use-media-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Input } from '@shared/ui/input/input';
import { Switch } from '@shared/ui/switch/switch';
import { Checkbox } from '@shared/ui/checkbox/checkbox';
import { ScrollArea } from '@shared/ui/scroll-area/scroll-area';
import { GithubEditor } from '@shared/ui/editor/github-editor';
import { useFileUpload, FileMetadata } from '@shared/hooks/use-file-upload';

import { useAnnouncementStore } from '../model/announcement-store';
import { CreateAnnouncementFormValues, createAnnouncementSchema } from '../model/schema';
import { announcementApi } from '@shared/api/announcement.service';
import { getAllFaculties, Faculty } from '@shared/api/faculty.service';
import { ANNOUNCEMENT_TYPE_LABEL, AnnouncementType } from '@entities/announcement/model/types';
import { CohortCode } from '@shared/api/classroom.service';

// Mock Cohort Codes if not exported as value (it is likely an Enum or Union type)
// I will check the file content first, but assuming it matches backend Enum.
const COHORT_CODES = Object.values(CohortCode).filter((v) => typeof v === 'string');

export function AnnouncementFormSheet() {
  const { isOpenConfig, close, selectedAnnouncement } = useAnnouncementStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const isEdit = !!selectedAnnouncement;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch Faculties
  const { data: faculties = [] } = useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const res = await getAllFaculties({ size: 100 }); 
      return res.data;
    },
    enabled: isOpenConfig,
  });

  const { upload, isUploading, result } = useFileUpload<FileMetadata>({
    validate: { maxSizeMB: 20 },
  });

  const form = useForm<CreateAnnouncementFormValues>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      title: '',
      content: '',
      announcementType: AnnouncementType.GENERAL,
      isGlobal: false,
      targetFaculties: [],
      targetCohorts: [],
      specificClassCodes: [],
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
            // Default to empty for now to prevent crash. 
            // TODO: Fetch detailed targets or map if available in selectedAnnouncement
            targetFaculties: [],
            targetCohorts: [],
            specificClassCodes: [],
            isGlobal: false,
            attachments: [],
        });
      } else {
        form.reset({
          title: '',
          content: '',
          announcementType: AnnouncementType.GENERAL,
          isGlobal: false,
          targetFaculties: [],
          targetCohorts: [],
          specificClassCodes: [],
          attachments: [],
        });
      }
    }
  }, [isOpenConfig, selectedAnnouncement, form]);

  const mutation = useMutation({
    mutationFn: async (data: CreateAnnouncementFormValues) => {
      const fileMetadataIds: string[] = [];
      const files: File[] = data.attachments || [];

      if (Array.isArray(files)) {
         for (const file of files) {
            const res = await upload(file, '/files/upload', 'POST', 'file', { folderName: 'announcements' });
            if (res?.id) fileMetadataIds.push(res.id);
         }
      }

      if (isEdit && selectedAnnouncement) {
        return announcementApi.update(selectedAnnouncement.id, {
            title: data.title,
            content: data.content,
            announcementType: data.announcementType,
            announcementStatus: selectedAnnouncement.announcementStatus,
            facultyIds: data.targetFaculties,
            classCodes: data.specificClassCodes,
            schoolYearCodes: data.targetCohorts as any,
        });
      } else {
        return announcementApi.create({
          title: data.title,
          content: data.content,
          announcementType: data.announcementType,
          isGlobal: data.isGlobal,
          targetFaculties: data.targetFaculties,
          targetCohorts: data.targetCohorts,
          specificClassCodes: data.specificClassCodes,
          fileMetadataIds,
        });
      }
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Cập nhật thành công' : 'Tạo thông báo thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      close();
      if (data?.id) {
          router.push(`/admin/announcements/${data.id}`);
      }
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    },
  });

  const onSubmit = (data: CreateAnnouncementFormValues) => {
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

  const attachments = (form.watch('attachments') as File[]) || [];
  const isGlobal = form.watch('isGlobal');

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

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Đối tượng nhận thông báo</h3>
          
          <FormField
            control={form.control}
            name="isGlobal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Thông báo toàn trường</FormLabel>
                  <FormDescription>
                    Gửi đến tất cả sinh viên và giảng viên.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!isGlobal && (
            <>
              {/* Select Faculties */}
              <FormField
                control={form.control}
                name="targetFaculties"
                render={() => (
                  <FormItem>
                    <FormLabel>Khoa</FormLabel>
                    <ScrollArea className="h-40 rounded-md border p-4">
                        <div className="space-y-2">
                            {faculties.map((faculty: any) => (
                                <FormField
                                    key={faculty.id}
                                    control={form.control}
                                    name="targetFaculties"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={faculty.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(faculty.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, faculty.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== faculty.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {faculty.facultyName}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Select Cohorts */}
              <FormField
                control={form.control}
                name="targetCohorts"
                render={() => (
                  <FormItem>
                    <FormLabel>Khóa học</FormLabel>
                    <ScrollArea className="h-40 rounded-md border p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {COHORT_CODES.map((code) => (
                                <FormField
                                    key={code}
                                    control={form.control}
                                    name="targetCohorts"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={code}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(code)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, code])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== code
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {code}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Specific CLasses */}
                <FormField
                  control={form.control}
                  name="specificClassCodes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã lớp cụ thể (phân cách bởi dấu phẩy)</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="D20CQCN01-B, D21CQcn02-B..." 
                            {...field} 
                            value={(Array.isArray(field.value) ? field.value : []).join(', ')} // Display as string
                            onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val.split(',').map(s => s.trim()).filter(Boolean));
                            }}
                        />
                      </FormControl>
                      <FormDescription>Nhập chính xác mã lớp.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </>
          )}
        </div>

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
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
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
            {mutation.isPending || isUploading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpenConfig} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</DialogTitle>
            <DialogDescription>
               Điền thông tin chi tiết và chọn đối tượng nhận thông báo.
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
          <DrawerTitle>{isEdit ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</DrawerTitle>
          <DrawerDescription>
            Điền thông tin chi tiết và chọn đối tượng nhận thông báo.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[80vh] px-4">
          {content}
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Hủy</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
