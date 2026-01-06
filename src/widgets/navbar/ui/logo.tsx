'use client';

import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function NavbarLogo() {
  return (
    <Link href="/" className="mr-6 flex items-center gap-2">
      <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
        <GraduationCap className="text-primary-foreground h-5 w-5" />
      </div>
      <span className="hidden text-lg font-semibold md:inline-block">PTIT Forum</span>
    </Link>
  );
}
