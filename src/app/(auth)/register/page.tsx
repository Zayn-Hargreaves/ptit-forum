import { RegisterForm } from '@features/auth/register/ui/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản | PTIT Forum',
  description: 'Gia nhập cộng đồng sinh viên PTIT để chia sẻ và học tập.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
