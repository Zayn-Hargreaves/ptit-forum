'use client';

import { authApi } from '@features/auth/api/auth-api';
import { SocialLogin } from '@features/auth/social-login/social-login';
import { zodResolver } from '@hookform/resolvers/zod';
import { BACKEND_ERROR_CODES } from '@shared/constants/error-codes';
import { ERROR_MESSAGES } from '@shared/constants/error-messages';
import { Button } from '@shared/ui/button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/ui/card/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Input } from '@shared/ui/input/input';
import { PasswordInput } from '@shared/ui/input/password-input';
import { RegisterInput, registerSchema } from '@shared/validators/auth';
import { isAxiosError } from 'axios';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: RegisterInput) => {
    try {
      await authApi.register(values);
      toast.success('Đăng ký thành công!', {
        description: 'Vui lòng kiểm tra mã OTP trong email.',
      });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error: unknown) {
      const data = isAxiosError(error)
        ? (error.response?.data as Record<string, unknown>) || {}
        : {};
      const code = data.code as number | undefined;
      if (code === BACKEND_ERROR_CODES.ACCOUNT_NOT_VERIFIED) {
        toast.info('Tài khoản này đang chờ xác thực.');
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        return;
      }
      if (code === BACKEND_ERROR_CODES.USER_EXISTED) {
        form.setError('email', {
          type: 'manual',
          message: 'Email này đã được đăng ký.',
        });
        form.setFocus('email');
        return;
      }
      toast.error(code && ERROR_MESSAGES[code] ? ERROR_MESSAGES[code] : 'Đăng ký thất bại');
    }
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">Đăng ký tài khoản</CardTitle>
        <CardDescription className="text-center">Gia nhập cộng đồng sinh viên PTIT</CardDescription>
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
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
                    <PasswordInput placeholder="mật khẩu" autoComplete="new-password" {...field} />
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

            <Button type="submit" className="w-full font-bold" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Đăng ký ngay'}
            </Button>
          </form>
        </Form>
        <div className="mt-6">
          <SocialLogin />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-muted-foreground text-center text-sm">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
