import { AuthLayout } from "@shared/components/auth/auth-layout";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Đăng nhập | PTIT Forum",
  description: "Đăng nhập vào hệ thống diễn đàn sinh viên PTIT",
};

export default function LoginPage() {
  return (
    <AuthLayout imageSrc="/ptit-building.png" imageAlt="PTIT Campus">
      <LoginForm />
    </AuthLayout>
  );
}
