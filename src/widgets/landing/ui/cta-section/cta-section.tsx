'use client';

import { useAuth } from '@shared/providers/auth-provider';

import { GuestContent } from './GuestContent';
import { LoggedInContent } from './LoggedInContent';

export function CTASection() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="h-[300px]" />;

  return (
    <section className="from-primary/5 via-background to-accent/5 border-t bg-linear-to-br py-20">
      <div className="container mx-auto px-4 text-center">
        {user ? <LoggedInContent username={user.fullName} /> : <GuestContent />}
      </div>
    </section>
  );
}
