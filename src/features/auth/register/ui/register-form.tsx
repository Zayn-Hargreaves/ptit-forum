"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@shared/ui/button/button";
import { Input } from "@shared/ui/input/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shared/ui/card/card";
import { RegisterInput, registerSchema } from "@shared/validators/auth";
import { PasswordInput } from "@shared/ui/input/password-input";
import { BACKEND_ERROR_CODES } from "@shared/constants/error-codes";
import { ERROR_MESSAGES } from "@shared/constants/error-messages";
import { authApi } from "@features/auth/api/auth-api";
import { SocialLogin } from "@features/auth/social-login/social-login";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: RegisterInput) => {
    try {
      await authApi.register(values);
      toast.success("Đăng ký thành công!", {
        description: "Vui lòng kiểm tra mã OTP trong email.",
      });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error: unknown) {
      const data = isAxiosError(error)
        ? (error.response?.data as Record<string, unknown>) || {}
        : {};
      const code = data.code as number | undefined;
      if (code === BACKEND_ERROR_CODES.ACCOUNT_NOT_VERIFIED) {
        toast.info("Tài khoản này đang chờ xác thực.");
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        return;
      }
      if (code === BACKEND_ERROR_CODES.USER_EXISTED) {
        form.setError("email", {
          type: "manual",
          message: "Email này đã được đăng ký.",
        });
        form.setFocus("email");
        return;
      }
      toast.error(
        code && ERROR_MESSAGES[code] ? ERROR_MESSAGES[code] : "Đăng ký thất bại"
      );
    }
  };

  return (
    <Card className="border-2 shadow-md w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Đăng ký tài khoản
        </CardTitle>
        <CardDescription className="text-center">
          Gia nhập cộng đồng sinh viên PTIT
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email sinh viên</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="sinhvien@student.ptit.edu.vn"
                        className="pl-9"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="mật khẩu"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="xác nhận mật khẩu"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full font-bold"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Đăng ký ngay"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-6">
          <SocialLogin />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
