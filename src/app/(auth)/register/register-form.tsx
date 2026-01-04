"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { SocialLogin } from "@shared/components/auth/social-login";
import { CodeVerification } from "@shared/components/auth/code-verification";
import { authApi } from "@shared/api/auth";
import { RegisterInput, registerSchema } from "@shared/validators/auth";
import { PasswordInput } from "@shared/ui/input/password-input";

type RegisterStep = "form" | "verification";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>("form");
  const [emailToVerify, setEmailToVerify] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const { isSubmitting } = form.formState;

  const safeGetServerMessage = (error: any) => {
    return (
      error?.response?.data?.message ||
      error?.message ||
      "Có lỗi xảy ra. Vui lòng thử lại."
    );
  };

  const onSubmit = async (values: RegisterInput) => {
    try {
      await authApi.register({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setEmailToVerify(values.email);
      setStep("verification");
      toast.success("Đăng ký thành công!", {
        description: "Mã xác thực (OTP) đã được gửi đến email của bạn.",
      });
    } catch (error: any) {
      toast.error("Đăng ký thất bại", {
        description: safeGetServerMessage(error),
      });
    }
  };

  const handleVerifyCode = async (code: string) => {
    if (!emailToVerify) return;
    setIsVerifying(true);

    try {
      await authApi.verifyEmail({
        email: emailToVerify,
        verificationCode: code,
      });

      toast.success("Xác thực thành công", {
        description: "Vui lòng đăng nhập để tiếp tục.",
      });

      router.push("/login");
    } catch (error: any) {
      toast.error("Xác thực thất bại", {
        description: safeGetServerMessage(error),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!emailToVerify) return;
    setIsVerifying(true);

    try {
      await authApi.resendVerifyCode(emailToVerify);
      toast.info("Đã gửi lại OTP", {
        description: "Vui lòng kiểm tra email của bạn.",
      });
    } catch (error: any) {
      toast.error("Không thể gửi lại", {
        description: safeGetServerMessage(error),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    if (emailToVerify) {
      form.setValue("email", emailToVerify);
    }
  };

  // --- RENDER STEP 2: VERIFICATION ---
  if (step === "verification") {
    return (
      <CodeVerification
        email={emailToVerify ?? ""}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        onBack={handleBackToForm}
        isLoading={isVerifying}
      />
    );
  }

  // --- RENDER STEP 1: REGISTRATION FORM ---
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
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="sinhvien@student.ptit.edu.vn"
                        className="pl-9"
                        autoComplete="email"
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
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
