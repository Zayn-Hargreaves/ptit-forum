import { AuthLayout } from "@shared/components/auth/auth-layout";
import { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | PTIT Forum",
  description: "Gia nhập cộng đồng sinh viên PTIT để chia sẻ và học tập.",
};

export default function RegisterPage() {
  return (
    <AuthLayout imageSrc="/ptit-building.png" imageAlt="PTIT Environment">
      <RegisterForm />
    </AuthLayout>
  );
}
