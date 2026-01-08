'use client';

import { topicApi } from '@entities/topic/api/topic-api';
import { ITopic } from '@entities/topic/model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/ui/button/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Input } from '@shared/ui/input/input';
import { Switch } from '@shared/ui/switch/switch';
import { Textarea } from '@shared/ui/textarea/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, Lock, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const topicSchema = z.object({
  name: z.string().min(3, 'Tên chủ đề phải có ít nhất 3 ký tự'),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

type TopicFormValues = z.infer<typeof topicSchema>;

interface EditTopicFormProps {
  topic: ITopic;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function EditTopicForm({ topic, onCancel, onSuccess }: EditTopicFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: topic.name,
      description: topic.description || '',
      isPublic: topic.isPublic,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: TopicFormValues) =>
      topicApi.updateTopic(topic.id, {
        name: values.name,
        description: values.description || '',
        isPublic: values.isPublic,
      }),
    onSuccess: (updatedTopic) => {
      toast.success('Đã cập nhật chủ đề');
      queryClient.invalidateQueries({ queryKey: ['topic', topic.id] });
      queryClient.setQueryData(['topic', topic.id], updatedTopic);
      onSuccess?.();
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật chủ đề');
    },
  });

  const onSubmit = (values: TopicFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
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
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center gap-2 text-base">
                  {field.value ? (
                    <Globe className="text-primary h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  Trạng thái: {field.value ? 'Công khai' : 'Riêng tư'}
                </FormLabel>
                <div className="text-muted-foreground text-sm">
                  {field.value
                    ? 'Mọi người đều có thể xem và tham gia chủ đề này.'
                    : 'Chỉ các thành viên được duyệt mới có thể xem nội dung.'}
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả / Thông tin chi tiết</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập thông tin chi tiết về chủ đề..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 border-t pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy bỏ
            </Button>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              'Đang lưu...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
