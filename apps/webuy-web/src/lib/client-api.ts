import {
  clearStoredSession,
  COMMERCE_API_BASE,
  getStoredToken,
  getStoredUserJson,
  setStoredSession,
} from '@/lib/commerce-api';
import {
  authUserSchema,
  cartsResponseSchema,
  productSchema,
  productsResponseSchema,
  usersResponseSchema,
  type AuthUser,
  type Cart,
  type Product,
  type User,
} from '@/lib/schemas';

class ApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Request failed (${status})`);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Thrown when `/auth/me` rejects the stored access token. */
export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired');
    this.name = 'SessionExpiredError';
  }
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new ApiError(response.status);
  }
  return response.json() as Promise<T>;
}

export async function fetchProducts(limit = 12, skip = 0): Promise<Product[]> {
  const json = await getJson<unknown>(
    `${COMMERCE_API_BASE}/products?limit=${limit}&skip=${skip}`
  );
  return productsResponseSchema.parse(json).products;
}

export async function fetchProduct(id: string | number): Promise<Product> {
  const json = await getJson<unknown>(`${COMMERCE_API_BASE}/products/${id}`);
  return productSchema.parse(json);
}

export async function fetchSearch(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) {
    return fetchProducts(36, 0);
  }
  const json = await getJson<unknown>(
    `${COMMERCE_API_BASE}/products/search?q=${encodeURIComponent(q)}`
  );
  return productsResponseSchema.parse(json).products;
}

export async function fetchUsers(limit = 30): Promise<User[]> {
  const json = await getJson<unknown>(`${COMMERCE_API_BASE}/users?limit=${limit}`);
  return usersResponseSchema.parse(json).users;
}

export async function fetchCarts(limit = 20): Promise<Cart[]> {
  const json = await getJson<unknown>(`${COMMERCE_API_BASE}/carts?limit=${limit}`);
  return cartsResponseSchema.parse(json).carts;
}

interface UserWithPassword extends User {
  password?: string;
}

function withoutTokens(user: AuthUser): AuthUser {
  const { accessToken: _accessToken, refreshToken: _refreshToken, ...safe } =
    user;
  return safe;
}

/** Session edits win. Directory data only fills fields the session does not have. */
function overlayProfile(primary: AuthUser, fallback: AuthUser): AuthUser {
  return authUserSchema.parse({
    ...fallback,
    ...primary,
    image: primary.image || fallback.image,
    phone: primary.phone || fallback.phone,
    gender: primary.gender || fallback.gender,
    birthDate: primary.birthDate || fallback.birthDate,
    address: primary.address ?? fallback.address,
    email: primary.email || fallback.email,
  });
}

function needsDirectoryProfile(user: AuthUser): boolean {
  return !user.image || !user.birthDate || !user.address || !user.phone;
}

async function enrichFromDirectory(user: AuthUser): Promise<AuthUser> {
  if (!needsDirectoryProfile(user)) {
    return user;
  }
  try {
    const json = await getJson<unknown>(`${COMMERCE_API_BASE}/users/${user.id}`);
    const directory = authUserSchema.parse(json);
    return overlayProfile(user, directory);
  } catch {
    return user;
  }
}

function readCachedUser(): AuthUser | null {
  const cached = getStoredUserJson();
  if (!cached) {
    return null;
  }
  return authUserSchema.parse(JSON.parse(cached));
}

function storeSafeUser(token: string, user: AuthUser): AuthUser {
  const safe = withoutTokens(user);
  setStoredSession(token, JSON.stringify(safe));
  return safe;
}

export async function loginAsRandomUser(): Promise<AuthUser> {
  const json = await getJson<{ users: UserWithPassword[] }>(
    `${COMMERCE_API_BASE}/users?limit=30`
  );
  const pool = json.users;
  if (pool.length === 0) {
    throw new Error('No users available');
  }
  const pick = pool[Math.floor(Math.random() * pool.length)]!;
  const password = pick.password ?? `${pick.username}pass`;

  const authJson = await getJson<unknown>(`${COMMERCE_API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: pick.username,
      password,
      expiresInMins: 60,
    }),
  });

  const authenticated = authUserSchema.parse(authJson);
  if (!authenticated.accessToken) {
    throw new Error('Login did not return accessToken');
  }
  const directory = authUserSchema.parse(pick);
  const user = overlayProfile(authenticated, directory);
  const safeUser = storeSafeUser(authenticated.accessToken, user);
  return { ...safeUser, accessToken: authenticated.accessToken };
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getStoredToken();
  const cached = readCachedUser();
  if (!token) {
    return cached;
  }

  try {
    const json = await getJson<unknown>(`${COMMERCE_API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const live = authUserSchema.parse(json);
    const session = cached ? overlayProfile(cached, live) : live;
    const enriched = await enrichFromDirectory(session);
    return storeSafeUser(token, enriched);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearStoredSession();
      throw new SessionExpiredError();
    }
    if (cached) {
      return cached;
    }
    clearStoredSession();
    return null;
  }
}

export async function logoutRequest(): Promise<void> {
  clearStoredSession();
}
