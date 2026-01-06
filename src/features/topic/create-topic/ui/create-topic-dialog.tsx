'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@shared/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/dialog/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Input } from '@shared/ui/input/input';
import { Textarea } from '@shared/ui/textarea/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select/select';
import { topicApi } from '@entities/topic/api/topic-api';

const createTopicSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  content: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  topicVisibility: z.enum(['PUBLIC', 'PRIVATE']),
});

type CreateTopicFormValues = z.infer<typeof createTopicSchema>;

interface CreateTopicDialogProps {
  categoryId: string;
}

export function CreateTopicDialog({ categoryId }: CreateTopicDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<CreateTopicFormValues>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: '',
      content: '',
      topicVisibility: 'PUBLIC',
    },
  });

  async function onSubmit(data: CreateTopicFormValues) {
    try {
      await topicApi.create(categoryId, {
        name: data.title,
        description: data.content,
        isPublic: data.topicVisibility === 'PUBLIC',
      });
      toast.success('Tạo chủ đề thành công');
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo chủ đề');
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo chủ đề
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tạo chủ đề mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chủ đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên chủ đề..." {...field} />
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
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về chủ đề này..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topicVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quyền truy cập</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quyền truy cập" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Công khai</SelectItem>
                      <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
