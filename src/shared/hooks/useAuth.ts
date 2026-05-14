/**
 * useAuth Hook
 * Hook para gerenciar autenticação e estado do usuário
 */

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

export interface AuthUser {
  id: number;
  openId: string;
  name?: string;
  email?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();
  const { mutateAsync: logout } = trpc.auth.logout.useMutation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return {
    user: user || null,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    isAuthenticated,
    logout,
  };
}
