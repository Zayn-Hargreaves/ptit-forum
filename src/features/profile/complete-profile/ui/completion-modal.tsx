"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

import { updateProfile } from "../api/update-profile";
import { ProfileFormValues, profileSchema } from "../model/schema";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
}: ProfileCompletionModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      studentId: "",
      faculty: "",
      class: "",
    },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["me"] });

      toast.success("Hồ sơ của bạn đã được cập nhật thành công!");
      onClose();
      router.push("/forum");
    },
    onError: () => {
      toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    mutation.mutate(values);
  };

  const handleSkip = () => {
    onClose();
    toast.info("Bạn có thể cập nhật hồ sơ sau trong phần Cài đặt.");
    router.push("/forum");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hoàn thiện hồ sơ</DialogTitle>
          <DialogDescription>
            Nhập thông tin chính xác để xác thực sinh viên.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã số sinh viên</FormLabel>
                  <FormControl>
                    <Input placeholder="B21DCCN001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khoa/Bộ môn</FormLabel>
                  <FormControl>
                    <Input placeholder="Công nghệ thông tin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lớp</FormLabel>
                  <FormControl>
                    <Input placeholder="D21CQCN01-B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Đang lưu..." : "Hoàn tất"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleSkip}
                disabled={mutation.isPending}
              >
                Bỏ qua
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
