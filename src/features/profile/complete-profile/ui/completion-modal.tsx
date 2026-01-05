"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog/dialog";
import { Button } from "@shared/ui/button/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form/form";
import { Input } from "@shared/ui/input/input";

import { sessionApi } from "@entities/session/api/session-api";
import { sessionKeys } from "@entities/session/lib/query-keys";
import {
  profileCompletionSchema,
  ProfileCompletionValues,
} from "../model/schema";
import { getErrorMessage } from "@shared/lib/utils";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
}: Readonly<ProfileCompletionModalProps>) {
  const queryClient = useQueryClient();

  const form = useForm<ProfileCompletionValues>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      fullName: "",
      studentCode: "",
      classCode: "",
      phone: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) form.reset();
  }, [isOpen, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ProfileCompletionValues) => sessionApi.updateProfile(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
      toast.success("Cập nhật hồ sơ thành công!");
      onClose();
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });

  const onSubmit = (values: ProfileCompletionValues) => {
    mutate(values);
  };

  const handleSkip = () => {
    onClose();
    toast.info("Bạn có thể cập nhật sau trong phần Cài đặt.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin sinh viên 🎓</DialogTitle>
          <DialogDescription>
            Nhập chính xác Mã SV và Lớp để hệ thống tự động xác định Khoa của
            bạn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mã sinh viên <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="B21DCCNxxx"
                        {...field}
                        className="uppercase placeholder:normal-case"
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mã lớp <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="D21CQCN01-B"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        className="uppercase placeholder:normal-case"
                        maxLength={12}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0123456789"
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Đang lưu..." : "Hoàn tất"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={handleSkip}
                disabled={isPending}
              >
                Để sau
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
