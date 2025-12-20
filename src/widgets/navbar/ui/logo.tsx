"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 mr-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <GraduationCap className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="hidden text-lg font-semibold md:inline-block">
        PTIT Forum
      </span>
    </Link>
  );
}
