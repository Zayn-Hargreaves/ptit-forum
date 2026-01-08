'use client';

import { authApi } from '@features/auth/api/auth-api';
import { CodeVerification } from '@features/auth/verify-email/ui/code-verification';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Input } from '@shared/ui/input/input';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// --- Schemas ---
const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Cần ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Cần ít nhất 1 chữ số')
    .regex(/[^A-Za-z0-9]/, 'Cần ít nhất 1 ký tự đặc biệt'),
});

type Step = 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Step 1: Email Form ---
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmitEmail = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      // Backend returns "email" or "success", but most importantly 200 OK
      await authApi.requestResetPassword(values.email);
      setEmail(values.email);
      setStep('OTP');
      toast.success('Đã gửi mã xác thực', {
        description: 'Vui lòng kiểm tra email của bạn',
      });
    } catch (error: unknown) {
      // Even if email not found, backend might return 200 (if we did it right),
      // but if it fails for other reasons:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error('Gửi yêu cầu thất bại', {
        description: err?.message || 'Vui lòng thử lại sau',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: OTP Logic (Handled by CodeVerification component) ---
  const onVerifyOtp = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(email, code);
      // Response.result should be the session ID (UUID)
      if (response && response.result) {
        setSessionId(response.result);
        setStep('PASSWORD');
        toast.success('Xác thực thành công', { description: 'Vui lòng đặt mật khẩu mới' });
      } else {
        throw new Error('Không nhận được Session ID');
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error('Xác thực thất bại', {
        description: err?.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    try {
      await authApi.requestResetPassword(email);
      toast.success('Đã gửi lại mã mới');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Không thể gửi lại mã');
    }
  };

  // --- Step 3: Password Form ---
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        passwordSessionId: sessionId,
        newPassword: values.password,
      });
      setStep('SUCCESS');
      toast.success('Đổi mật khẩu thành công!');
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error('Đổi mật khẩu thất bại', {
        description: err?.response?.data?.message || 'Vui lòng thử lại',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---

  const renderEmailStep = () => (
    <Card className="border-muted/40 w-full max-w-md shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push('/login')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Quên mật khẩu</CardTitle>
        </div>
        <CardDescription>Nhập địa chỉ email liên kết với tài khoản của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderOtpStep = () => (
    <CodeVerification
      email={email}
      onVerify={onVerifyOtp}
      onResend={onResendOtp}
      onBack={() => setStep('EMAIL')}
      isLoading={isLoading}
      title="Nhập mã xác thực"
      description={`Mã 6 số đã được gửi tới ${email}`}
    />
  );

  const renderPasswordStep = () => (
    <Card className="border-muted/40 w-full max-w-md shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep('OTP')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Đặt mật khẩu mới</CardTitle>
        </div>
        <CardDescription>
          Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card className="w-full max-w-md border-green-200 bg-green-50/50 shadow-lg">
      <CardContent className="space-y-4 pt-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl text-green-700">Thành công!</CardTitle>
          <p className="text-muted-foreground">
            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.
          </p>
        </div>
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link href="/login">Đăng nhập ngay</Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-[500px] items-center justify-center p-4">
      {step === 'EMAIL' && renderEmailStep()}
      {step === 'OTP' && renderOtpStep()}
      {step === 'PASSWORD' && renderPasswordStep()}
      {step === 'SUCCESS' && renderSuccessStep()}
    </div>
  );
}
