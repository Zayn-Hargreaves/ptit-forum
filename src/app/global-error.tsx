'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('Global error occurred:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Đã có lỗi xảy ra!</h2>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
            onClick={() => reset()}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
