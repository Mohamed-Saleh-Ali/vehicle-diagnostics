import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../utils/api';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  checkingSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(() => Boolean(tokenStore.get()));

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  // restore session from stored token
  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => tokenStore.clear())
      .finally(() => setCheckingSession(false));
  }, []);

  // fired by api.ts on 401
  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.login({ email, password });
    tokenStore.set(token);
    setUser(user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { token, user } = await api.register({ name, email, password });
    tokenStore.set(token);
    setUser(user);
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'admin', checkingSession, login, register, logout }),
    [user, checkingSession, login, register, logout]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
