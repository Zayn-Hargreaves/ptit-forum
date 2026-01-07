"use client";

import { Button } from "@shared/ui/button/button";
import { GoogleIcon } from "@shared/components/icons/brand-icons";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export function SocialLogin() {
  const handleLogin = (provider: "google") => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={() => handleLogin("google")}
        className="w-full bg-background hover:bg-muted transition-colors border-2"
        type="button"
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Google
      </Button>
    </div>
  );
}
