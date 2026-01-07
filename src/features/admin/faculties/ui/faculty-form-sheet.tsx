'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { createFaculty, updateFaculty } from '@/shared/api/faculty.service';
import { Button } from '@/shared/ui/button/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form/form';
import { Input } from '@/shared/ui/input/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet/sheet';
import { Textarea } from '@/shared/ui/textarea/textarea';

import { useFacultyStore } from '../model/faculty-store';

/* ---------------- Schema ---------------- */
const formSchema = z.object({
  facultyName: z.string().min(1, 'Tên khoa là bắt buộc'),
  facultyCode: z.string().min(1, 'Mã khoa là bắt buộc'),
  description: z.string().optional(),
});

type FacultyFormValues = z.infer<typeof formSchema>;

/* ---------------- Component ---------------- */
export function FacultyFormSheet() {
  const { selectedFaculty, isOpen, close } = useFacultyStore();
  const queryClient = useQueryClient();

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facultyName: '',
      facultyCode: '',
      description: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const isEdit = !!selectedFaculty;

  /* ---------------- Sync form ---------------- */
  useEffect(() => {
    if (isOpen) {
      if (selectedFaculty) {
        reset({
          facultyName: selectedFaculty.facultyName || '',
          facultyCode: selectedFaculty.facultyCode || '',
          description: selectedFaculty.description || '',
        });
      } else {
        reset({
          facultyName: '',
          facultyCode: '',
          description: '',
        });
      }
    }
  }, [selectedFaculty, isOpen, reset]);

  /* ---------------- Submit ---------------- */
  const onSubmit = async (values: FacultyFormValues) => {
    try {
      if (isEdit && selectedFaculty) {
        await updateFaculty(selectedFaculty.id, values);
        toast.success('Cập nhật khoa thành công');
      } else {
        await createFaculty(values);
        toast.success('Tạo khoa mới thành công');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-faculties'] });
      close();
    } catch (error) {
      toast.error('Thao tác thất bại');
      console.error(error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex h-full flex-col sm:max-w-lg">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold">
            {isEdit ? 'Cập nhật khoa' : 'Tạo khoa mới'}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? 'Chỉnh sửa thông tin khoa trong hệ thống' : 'Thêm mới một khoa vào hệ thống'}
          </SheetDescription>
        </SheetHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4 px-4 py-2">
            <FormField
              control={form.control}
              name="facultyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên khoa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên khoa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facultyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mã khoa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã khoa (VD: CNPM)" {...field} />
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
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả khoa (không bắt buộc)" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden button to enable form submission on Enter */}
            <button type="submit" className="hidden" />
          </form>
        </Form>

        {/* Footer */}
        <SheetFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={close} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>

          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? 'Lưu thay đổi' : 'Tạo khoa'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
