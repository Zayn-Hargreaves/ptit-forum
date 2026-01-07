import { LoginForm } from "@features/auth/login/ui/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | PTIT Forum",
  description: "Đăng nhập vào hệ thống diễn đàn sinh viên PTIT",
};

export default function LoginPage() {
  return <LoginForm />;
}
