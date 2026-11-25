/** Public commerce API origin (not a secret). */
export const COMMERCE_API_BASE = 'https://dummyjson.com';

export const AUTH_TOKEN_KEY = 'webuy_access_token';
export const AUTH_USER_KEY = 'webuy_auth_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredSession(token: string, userJson: string): void {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, userJson);
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUserJson(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(AUTH_USER_KEY);
}
