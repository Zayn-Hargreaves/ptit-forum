'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Textarea } from '@shared/ui/textarea/textarea';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ProcessReportRequest, ReportAction } from '../model/types';

const resolveSchema = z.object({
  note: z.string().min(1, 'Vui lòng nhập lý do xử lý'),
});

type ResolveFormValues = z.infer<typeof resolveSchema>;

interface ResolveReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ReportAction | null;
  isPending: boolean;
  onSubmit: (data: ProcessReportRequest) => void;
}

export function ResolveReportDialog({
  open,
  onOpenChange,
  action,
  isPending,
  onSubmit,
}: Readonly<ResolveReportDialogProps>) {
  const form = useForm<ResolveFormValues>({
    resolver: zodResolver(resolveSchema),
    defaultValues: {
      note: '',
    },
  });

  const handleSubmit = (values: ResolveFormValues) => {
    if (!action) return;
    onSubmit({
      action,
      note: values.note,
    });
  };

  const getTitle = () => {
    switch (action) {
      case ReportAction.DELETE_CONTENT:
        return 'Xóa nội dung vi phạm';
      case ReportAction.KEEP_CONTENT:
        return 'Giữ nội dung (Báo cáo sai)';
      case ReportAction.WARN_USER:
        return 'Cảnh cáo người dùng';
      default:
        return 'Xử lý báo cáo';
    }
  };

  const getDescription = () => {
    switch (action) {
      case ReportAction.DELETE_CONTENT:
        return 'Hành động này sẽ xóa bài viết/bình luận vĩnh viễn và đánh dấu báo cáo là Đã xử lý.';
      case ReportAction.KEEP_CONTENT:
        return 'Hành động này sẽ giữ nguyên nội dung và đánh dấu báo cáo là Từ chối.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do xử lý (Lưu Audit Log)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do tại sao bạn chọn hành động này..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                variant={action === ReportAction.DELETE_CONTENT ? 'destructive' : 'default'}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
