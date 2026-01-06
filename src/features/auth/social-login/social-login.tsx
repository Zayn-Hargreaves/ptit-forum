'use client';

import { GoogleIcon } from '@shared/components/icons/brand-icons';
import { Button } from '@shared/ui/button/button';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export function SocialLogin() {
  const handleLogin = (provider: 'google') => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="border-muted w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Hoặc tiếp tục với</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={() => handleLogin('google')}
        className="bg-background hover:bg-muted w-full border-2 transition-colors"
        type="button"
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Google
      </Button>
    </div>
  );
}
