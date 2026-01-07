'use client';

import { reportApi } from '@entities/interaction/api/report-api';
import { REPORT_REASON_LABELS, TargetType } from '@entities/interaction/model/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select/select';
import { Textarea } from '@shared/ui/textarea/textarea';
import { ReportFormValues, reportSchema } from '@shared/validators/auth';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
  targetType: TargetType;
}

export function ReportDialog({
  open,
  onOpenChange,
  targetId,
  targetType,
}: Readonly<ReportDialogProps>) {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reason: '' as any,
      description: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ReportFormValues) =>
      reportApi.create({
        targetId,
        targetType,
        reason: values.reason,
        description: values.description,
      }),
    onSuccess: () => {
      toast.success('Đã gửi báo cáo. Cảm ơn đóng góp của bạn!');
      onOpenChange(false);
      form.reset();
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const msg = err?.response?.data?.message;
      if (msg === 'Report already existed') {
        toast.warning('Bạn đã báo cáo nội dung này rồi.');
      } else if (msg === 'Cannot report self') {
        toast.error('Bạn không thể báo cáo chính mình.');
      } else {
        toast.error('Gửi báo cáo thất bại.');
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Báo cáo vi phạm
          </DialogTitle>
          <DialogDescription>
            Hãy cho chúng tôi biết vấn đề bạn gặp phải với nội dung này.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
            {/* Reason Select */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Textarea */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi tiết thêm (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả cụ thể vấn đề..."
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
                className="bg-destructive hover:bg-destructive/90"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi báo cáo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
