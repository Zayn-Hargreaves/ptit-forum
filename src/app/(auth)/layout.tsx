"use client";

import type React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthLayout({
  children,
  imageSrc = "/ptit-building.png",
  imageAlt = "PTIT Building",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12 lg:bg-linear-to-br lg:from-slate-900 lg:to-slate-800">
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-4 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex flex-col items-center justify-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">PTIT Forum</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Cộng đồng học tập và chia sẻ kiến thức của sinh viên PTIT
              </p>
            </div>
          </Link>

          <div className="mb-8 h-px bg-border" />

          {children}
        </div>
      </div>
    </div>
  );
}
