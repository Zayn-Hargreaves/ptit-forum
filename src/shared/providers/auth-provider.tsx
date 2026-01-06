'use client';

import { sessionKeys } from '@entities/session/lib/query-keys';
import { useMe } from '@entities/session/model/queries';
import { User, UserPermission } from '@entities/session/model/types';
import { apiClient } from '@shared/api';
import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useMemo } from 'react';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  hasPermission: (p: UserPermission) => boolean;
  hasAnyPermission: (...p: UserPermission[]) => boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();

  // We rely on HttpOnly cookies now, so no need to sync from localStorage to cookies or vice versa.
  // The 'useMe' query calls /users/me via the proxy, which forwards the cookie.
  // If the cookie is missing or invalid, useMe returns error/null.

  const { data: user, isLoading, isSuccess, refetch } = useMe();

  const isAuthenticated = isSuccess && !!user;

  const permissions = useMemo(() => new Set<UserPermission>(user?.permissions ?? []), [user]);
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed silently', error);
    } finally {
      qc.removeQueries({ queryKey: sessionKeys.me() });

      window.location.href = '/login';
    }
  }, [qc]);

  const hasPermission = useCallback((p: UserPermission) => permissions.has(p), [permissions]);

  const hasAnyPermission = useCallback(
    (...p: UserPermission[]) => p.some((x) => permissions.has(x)),
    [permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated,
      isLoading,
      logout,
      hasPermission,
      hasAnyPermission,
      refreshSession: async () => {
        await refetch();
      },
    }),
    [user, isAuthenticated, isLoading, logout, hasPermission, hasAnyPermission, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
