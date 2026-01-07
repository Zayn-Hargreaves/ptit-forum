"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { authApi } from "@features/auth/api/auth-api";
import { CodeVerification } from "@features/auth/verify-email/ui/code-verification";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const emailFromStorage = sessionStorage.getItem("verification_email");

    const finalEmail = emailFromUrl || emailFromStorage;

    if (!finalEmail) {
      toast.error("Không tìm thấy thông tin email cần xác thực");
      router.replace("/login");
    } else {
      setEmail(finalEmail);
      if (emailFromStorage) {
        sessionStorage.removeItem("verification_email");
      }
    }
  }, [router, searchParams]);

  const handleVerify = async (code: string) => {
    if (!email) return;
    setIsLoading(true);
    try {
      await authApi.verifyEmail({ email, verificationCode: code });
      toast.success("Xác thực thành công. Vui lòng đăng nhập.");
      router.replace("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Mã xác thực không đúng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await authApi.resendVerifyCode(email);
      toast.success(`Đã gửi lại mã mới tới ${email}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể gửi lại mã.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <CodeVerification
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        isLoading={isLoading}
        onBack={() => router.back()}
      />
    </div>
  );
}
