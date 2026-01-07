'use client';

import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Input } from '@shared/ui/input/input';
import { Label } from '@shared/ui/label/label';
import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Props for the CodeVerification component.
 * @interface CodeVerificationProps
 * @property {string} email - The email address to which the verification code was sent.
 * @property {(code: string) => Promise<void> | void} onVerify - Function to call with the code when verification occurs.
 * @property {() => void} onResend - Function to call to resend the verification code.
 * @property {() => Promise<void> | void} onBack - Function to call when the back button is clicked.
 * @property {boolean} [isLoading] - Optional loading state for the button.
 * @property {string} [title] - Optional title for the verification card.
 * @property {string} [description] - Optional description for the verification card.
 */
interface CodeVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<void> | void;
  onResend: () => void;
  onBack: () => Promise<void> | void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

/**
 * Component for email verification.
 *
 * @param {CodeVerificationProps} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
export function CodeVerification({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  title = 'Xác thực email',
  description = 'Nhập mã 6 số được gửi đến email của bạn',
}: CodeVerificationProps) {
  const [code, setCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  /**
   * Handles changes to the input field for the verification code.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input.
   */
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  /**
   * Handles verification code submission.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.warning('Mã không hợp lệ', {
        description: 'Vui lòng nhập đầy đủ 6 số',
      });
      return;
    }
    try {
      await onVerify(code);
    } catch (_error) {
      toast.error('Lỗi xác thực', {
        description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };

  /**
   * Handles resending the verification code.
   */
  const RESEND_COOLDOWN_SECONDS = 60;

  const handleResend = () => {
    try {
      setResendTimer(RESEND_COOLDOWN_SECONDS);
      onResend();
    } catch (_error) {
      setResendTimer(0); // Reset timer on error
      toast.error('Lỗi gửi lại mã', {
        description: 'Không thể gửi lại mã. Vui lòng thử lại.',
      });
      return;
    }
    toast.info('Đã gửi lại mã', {
      description: 'Vui lòng kiểm tra hộp thư của bạn',
    });
  };

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              Promise.resolve(onBack()).catch(() => {
                toast.error('Lỗi điều hướng', {
                  description: 'Không thể quay lại. Vui lòng thử lại.',
                });
              });
            }}
            className="hover:bg-muted rounded-lg p-1 transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label>Mã xác thực</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="******"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              className="h-14 text-center font-mono text-3xl tracking-[1em]" // Larger size for readability
              autoFocus
              required
            />
            <p className="text-muted-foreground text-center text-sm">
              Đã gửi đến <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? 'Đang xác thực...' : 'Xác thực'}
          </Button>

          <div className="space-y-2 text-center">
            <p className="text-muted-foreground text-sm">Không nhận được mã?</p>
            <Button
              type="button"
              variant="link"
              onClick={handleResend}
              disabled={resendTimer > 0 || isLoading}
              className="h-auto p-0 font-normal"
            >
              {resendTimer > 0 ? `Gửi lại sau ${resendTimer}s` : 'Gửi lại mã mới'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
