'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@shared/ui/textarea/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { subjectApi } from '@/shared/api/subject.service';

// Đảm bảo import đúng từ file schema vừa sửa
import { CreateSubjectFormValues, createSubjectSchema } from '../model/schema';
import { useSubjectStore } from '../model/subject-store';

export function SubjectFormSheet() {
  const { isOpenConfig, close, selectedSubject } = useSubjectStore();
  const queryClient = useQueryClient();
  const isEdit = !!selectedSubject;
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<CreateSubjectFormValues>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      subjectName: '',
      subjectCode: '',
      credit: 0, // Giá trị mặc định là number khớp với schema
      description: '',
    },
  });

  // Reset form khi mở modal hoặc thay đổi subject được chọn
  useEffect(() => {
    if (isOpenConfig) {
      form.reset({
        subjectName: selectedSubject?.subjectName || '',
        subjectCode: selectedSubject?.subjectCode || '',
        credit: selectedSubject?.credit || 0,
        description: selectedSubject?.description || '',
      });
    }
  }, [isOpenConfig, selectedSubject, form]);

  const mutation = useMutation({
    mutationFn: async (data: CreateSubjectFormValues) => {
      if (isEdit && selectedSubject) {
        return subjectApi.update(selectedSubject.id, data);
      } else {
        return subjectApi.create(data);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Cập nhật thành công' : 'Tạo môn học thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      close();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    },
  });

  const onSubmit = (data: CreateSubjectFormValues) => {
    mutation.mutate(data);
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 font-sans">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên môn học</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Lập trình Java" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã môn học</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: INT1340" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tín chỉ</FormLabel>
              <FormControl>
                {/* type="number" trả về string, nhưng z.coerce sẽ tự chuyển thành number.
                  Không cần ép kiểu thủ công ở onChange.
                */}
                <Input type="number" min={1} placeholder="3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả (Tùy chọn)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về môn học..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close} disabled={mutation.isPending}>
            Hủy
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpenConfig} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết của môn học vào biểu mẫu dưới đây.
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
          <DrawerTitle>{isEdit ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}</DrawerTitle>
          <DrawerDescription>Điền thông tin chi tiết của môn học.</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[70vh] px-4">{content}</ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Hủy</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
