'use client';

import Image from 'next/image';
import Link from 'next/link';

export function NavbarLogo() {
  return (
    <Link href="/" className="mr-6 flex items-center gap-2">
      <Image src="/logo.svg" alt="Logo" width={36} height={36} className="h-9 w-9" />
      <span className="hidden text-lg font-semibold md:inline-block">PTIT Forum</span>
    </Link>
  );
}
