import { useCallback, useState } from 'react';
import { BO_ADMIN, BO_AUTH_STORAGE_KEY } from '@/features/auth/constants';

function readSession(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.sessionStorage.getItem(BO_AUTH_STORAGE_KEY) === '1';
}

export function useBoAuth() {
  const [authenticated, setAuthenticated] = useState(readSession);

  const login = useCallback((email: string, password: string) => {
    const ok = email === BO_ADMIN.email && password === BO_ADMIN.password;
    if (ok) {
      window.sessionStorage.setItem(BO_AUTH_STORAGE_KEY, '1');
      setAuthenticated(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(BO_AUTH_STORAGE_KEY);
    setAuthenticated(false);
  }, []);

  return { authenticated, login, logout };
}
