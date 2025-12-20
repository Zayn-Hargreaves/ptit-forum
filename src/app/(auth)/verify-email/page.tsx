"use client";

import { useRouter } from "next/navigation";
import { CodeVerification } from "@shared/components/auth/code-verification";
import { authApi } from "@shared/api/auth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verification_email");
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);
      sessionStorage.removeItem("verification_email");
    }
  }, [router]);

  const handleVerify = async (code: string) => {
    if (!email) {
      toast.error("Email not found");
      return;
    }
    setIsLoading(true);
    try {
      await authApi.verifyEmail({ email, verificationCode: code });
      toast.success("Xác thực thành công. Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error: any) {
      toast.error("Xác thực thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }
    setIsResending(true);
    try {
      await authApi.resendVerifyCode(email);
      toast.info("Đã gửi lại mã mới.");
    } catch (error: any) {
      toast.error("Không thể gửi lại mã.");
    } finally {
      setIsResending(false);
    }
  };

  return email ? (
    <div className="flex justify-center items-center min-h-[60vh]">
      <CodeVerification
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        isLoading={isLoading}
        onBack={() => router.back()}
      />
    </div>
  ) : null;
}
