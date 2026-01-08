'use client';

import { authApi } from '@features/auth/api/auth-api';
import { SocialLogin } from '@features/auth/social-login/social-login';
import { zodResolver } from '@hookform/resolvers/zod';
import { BACKEND_ERROR_CODES } from '@shared/constants/error-codes';
import { validateRedirectUrl } from '@shared/lib/utils';
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
import { LoginInput, loginSchema } from '@shared/validators/auth';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const redirectUrl = validateRedirectUrl(searchParams.get('redirect'));

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginInput) => {
    try {
      await authApi.login(values);

      await queryClient.invalidateQueries({ queryKey: ['me'] });

      toast.success('Đăng nhập thành công', {
        description: 'Chào mừng bạn quay trở lại!',
      });

      router.replace(redirectUrl);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ code: number; message: string }>;
      const errorData = axiosError.response?.data;

      if (errorData?.code === BACKEND_ERROR_CODES.ACCOUNT_NOT_VERIFIED) {
        toast.info('Tài khoản chưa xác thực. Đang chuyển hướng tới trang nhập OTP...');
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        return;
      }

      toast.error(errorData?.message || 'Thông tin đăng nhập không chính xác');
    }
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">Đăng nhập</CardTitle>
        <CardDescription className="text-center">
          Nhập email và mật khẩu để truy cập diễn đàn
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
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <FormControl>
                      <Input
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Mật khẩu</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-primary text-xs font-medium hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-bold" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <SocialLogin />
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="text-muted-foreground text-center text-sm">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
