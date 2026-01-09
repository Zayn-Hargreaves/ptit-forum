'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthLayout({
  children,
  imageSrc = '/ptit-building.png',
  imageAlt = 'PTIT Building',
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center lg:bg-linear-to-br lg:from-slate-900 lg:to-slate-800 lg:p-12">
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={imageSrc}
            alt={imageAlt || 'Authentication Image'}
            fill
            className="object-cover"
            priority
            sizes="50vw"
            unoptimized
          />
        </div>
      </div>

      <div className="bg-background flex w-full flex-col items-center justify-center p-4 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex flex-col items-center justify-center gap-4">
            <Image src="/logo.svg" alt="Logo" width={64} height={64} className="h-16 w-16" />
            <div className="text-center">
              <h1 className="text-foreground text-3xl font-bold">PTIT Forum</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Cộng đồng học tập và chia sẻ kiến thức của sinh viên PTIT
              </p>
            </div>
          </Link>

          <div className="bg-border mb-8 h-px" />

          {children}
        </div>
      </div>
    </div>
  );
}
