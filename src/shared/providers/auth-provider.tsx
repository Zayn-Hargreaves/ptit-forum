"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useMe } from "@shared/hooks/useMe";
import apiClient from "@shared/lib/axios";
import type { UserAuthResponse, UserPermission } from "@shared/types/auth";

type AuthContextValue = {
  user: UserAuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  hasPermission: (p: UserPermission) => boolean;
  hasAnyPermission: (...p: UserPermission[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading, isSuccess } = useMe();

  const isAuthenticated = useMemo(() => isSuccess && !!user, [isSuccess, user]);

  const permissions = useMemo(
    () => new Set<UserPermission>(user?.permissions ?? []),
    [user]
  );

  const logout = useCallback(async () => {
    qc.setQueryData(["me"], null);

    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      qc.removeQueries({ queryKey: ["me"], exact: true });

      router.push("/login");
      router.refresh();
    }
  }, [qc, router]);

  const hasPermission = useCallback(
    (p: UserPermission) => permissions.has(p),
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (...p: UserPermission[]) => p.some((x) => permissions.has(x)),
    [permissions]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated,
      isLoading,
      logout,
      hasPermission,
      hasAnyPermission,
    }),
    [user, isAuthenticated, isLoading, logout, hasPermission, hasAnyPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
