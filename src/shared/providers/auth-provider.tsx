"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@shared/hooks/useMe";
import apiClient from "@shared/lib/axios";
import { User } from "@shared/types/auth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  permissions: Set<string>;
  logout: () => Promise<void>;
  hasPermission: (p: string) => boolean;
  hasAnyPermission: (...p: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { data: user, isLoading } = useMe();

  // ✅ Optimistic UI: KHÔNG block toàn app nữa
  // App shell (layout/navbar/footer) render ngay. Những chỗ cần auth tự handle loading.

  const permissions = useMemo(() => new Set(user?.permissions ?? []), [user]);

  const logout = useCallback(async () => {
    try {
      // Gọi Route Handler để xóa HttpOnly Cookie
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // 1. Set user về null ngay lập tức để update UI
      qc.setQueryData(["me"], null);

      // 2. QUAN TRỌNG: Xóa toàn bộ cache của React Query
      // Để đảm bảo không còn dữ liệu rác của user cũ
      qc.removeQueries();

      // 3. (Optional) Redirect về trang login hoặc trang chủ
      // window.location.href = "/auth/login";
    }
  }, [qc]);

  const hasPermission = useCallback(
    (p: string) => permissions.has(p),
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (...p: string[]) => p.some((x) => permissions.has(x)),
    [permissions]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      permissions,
      logout,
      hasPermission,
      hasAnyPermission,
    }),
    [user, isLoading, permissions, logout, hasPermission, hasAnyPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
