"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@shared/ui/button/button";
import { Input } from "@shared/ui/input/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form/form";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card/card";

import { sessionApi } from "@entities/session/api/session-api";
import { useMe } from "@entities/session/model/queries";
import { sessionKeys } from "@entities/session/lib/query-keys";
import { AvatarUploader } from "@features/profile/avatar-uploader/ui/avatar-uploader";
import { ProfileFormValues, profileSchema } from "@shared/validators/auth";
import { getErrorMessage } from "@shared/lib/utils";
import { compressAvatar } from "@shared/lib/file";

export function UpdateProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isLoadingUser } = useMe();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      studentCode: "",
      classCode: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      fullName: user.fullName || "",
      phone: user.phone || "",
      studentCode: user.studentCode || "",
      classCode: user.classCode || "",
    });
  }, [user, form]);

  const { mutate: handleSave, isPending } = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (avatarFile) {
        const compressed = await compressAvatar(avatarFile);
        await sessionApi.uploadAvatar(compressed);
      }

      return await sessionApi.updateProfile(values);
    },
    onSuccess: async () => {
      toast.success("Cập nhật hồ sơ thành công");
      setAvatarFile(null);

      await queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
      router.push("/");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      toast.error(`Lỗi: ${message}`);
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    handleSave(values);
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-center uppercase">
          Thông tin cá nhân
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <AvatarUploader
            currentAvatarUrl={user?.avatarUrl}
            fallbackName={user?.fullName || "User"}
            value={avatarFile}
            onChange={setAvatarFile}
            disabled={isPending}
          />
          <p className="text-sm text-muted-foreground">
            Click vào ảnh để thay đổi
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Họ và tên <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
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
                      <FormLabel>Lớp hành chính</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="D21CQCN01-B"
                          className="uppercase placeholder:normal-case"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Lớp quản lý của bạn (VD: D21CQCN01-B)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="09xxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã sinh viên</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="B21DCCNxxx"
                          className="uppercase placeholder:normal-case"
                          maxLength={10}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Liên hệ admin nếu cần thay đổi mã SV
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[150px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
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
      </CardContent>
    </Card>
  );
}
