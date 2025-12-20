"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CodeVerification } from "@shared/components/auth/code-verification";
import { authApi } from "@shared/api/auth";
import { toast } from "sonner";
import { useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);

  if (!email) {
    router.push("/login");
    return null;
  }

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    try {
      await authApi.verifyEmail({ email, verificationCode: code });
      toast.success("Xác thực thành công. Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xác thực thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendVerifyCode(email);
      toast.info("Đã gửi lại mã mới.");
    } catch (error: any) {
      toast.error("Không thể gửi lại mã.");
    }
  };

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
