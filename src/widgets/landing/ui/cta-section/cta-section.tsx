"use client";

import { useAuth } from "@shared/providers/auth-provider";
import { LoggedInContent } from "./LoggedInContent";
import { GuestContent } from "./GuestContent";

export function CTASection() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="h-[300px]" />;

  return (
    <section className="border-t bg-linear-to-br from-primary/5 via-background to-accent/5 py-20">
      <div className="container mx-auto px-4 text-center">
        {user ? <LoggedInContent username={user.fullName} /> : <GuestContent />}
      </div>
    </section>
  );
}
