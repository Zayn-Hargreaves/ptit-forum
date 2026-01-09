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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CohortCode } from '@/shared/api/classroom.service';
import { getAllFaculties } from '@/shared/api/faculty.service'; // Giả định có service này
import { subjectApi } from '@/shared/api/subject.service'; // Giả định có service này
import { subjectReferenceApi } from '@/shared/api/subject-reference.service';

import { CreateSubjectReferenceFormValues, createSubjectReferenceSchema } from '../model/schema';
import { useSubjectReferenceStore } from '../model/subject-reference-store';

export function SubjectReferenceFormSheet() {
  const { isOpenCreate, close } = useSubjectReferenceStore();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Fetch Data cho Select Box
  const { data: facultiesRes } = useQuery({
    queryKey: ['faculties-options'],
    queryFn: () => getAllFaculties({ size: 100 }),
    enabled: isOpenCreate,
  });

  const { data: subjectsRes } = useQuery({
    queryKey: ['subjects-options'],
    queryFn: () => subjectApi.search({ size: 100 }), // API search subject
    enabled: isOpenCreate,
  });

  const form = useForm<CreateSubjectReferenceFormValues>({
    resolver: zodResolver(createSubjectReferenceSchema),
    defaultValues: {
      subjectId: '',
      facultyId: '',
      semesterId: 1,
      cohortCode: CohortCode.D21, // Default value example
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateSubjectReferenceFormValues) => subjectReferenceApi.create(data),
    onSuccess: () => {
      toast.success('Thêm tham chiếu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-subject-references'] });
      form.reset();
      close();
    },
    onError: () => {
      toast.error('Có lỗi xảy ra');
    },
  });

  const onSubmit = (data: CreateSubjectReferenceFormValues) => {
    mutation.mutate(data);
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 font-sans">
        {/* Chọn Khoa */}
        <FormField
          control={form.control}
          name="facultyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khoa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {facultiesRes?.data?.map((f: { id: string; facultyName: string }) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.facultyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Chọn Môn học */}
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Môn học</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjectsRes?.data?.map(
                    (s: { id: string; subjectName: string; subjectCode: string }) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.subjectName} ({s.subjectCode})
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Chọn Khóa (Enum) */}
        <FormField
          control={form.control}
          name="cohortCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khóa học</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khóa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CohortCode).map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nhập Học kỳ */}
        <FormField
          control={form.control}
          name="semesterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Học kỳ</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close}>
            Hủy
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Đang xử lý...' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpenCreate} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm tham chiếu môn học</DialogTitle>
            <DialogDescription>Liên kết môn học với khoa, khóa và học kỳ.</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpenCreate} onOpenChange={(open) => !open && close()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Thêm tham chiếu môn học</DrawerTitle>
          <DrawerDescription>Liên kết môn học với khoa, khóa và học kỳ.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{content}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Hủy</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
