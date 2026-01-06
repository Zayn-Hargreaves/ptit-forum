'use client';

import { cn } from '@shared/lib/utils';
import { Eye, EyeOff, Lock } from 'lucide-react';
import * as React from 'react';

import { Input } from './input';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showLockIcon?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showLockIcon = true, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative">
        {showLockIcon && (
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        )}

        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={cn(showLockIcon ? 'pr-10 pl-9' : 'pr-10', className)}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
