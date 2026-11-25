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

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
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
    return fetchProducts(24, 0);
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

  const user = authUserSchema.parse(authJson);
  if (!user.accessToken) {
    throw new Error('Login did not return accessToken');
  }
  const { accessToken, refreshToken: _refresh, ...safeUser } = user;
  setStoredSession(accessToken, JSON.stringify(safeUser));
  return user;
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) {
    const cached = getStoredUserJson();
    return cached ? authUserSchema.parse(JSON.parse(cached)) : null;
  }

  try {
    const json = await getJson<unknown>(`${COMMERCE_API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return authUserSchema.parse(json);
  } catch {
    const cached = getStoredUserJson();
    if (cached) {
      return authUserSchema.parse(JSON.parse(cached));
    }
    clearStoredSession();
    return null;
  }
}

export async function logoutRequest(): Promise<void> {
  clearStoredSession();
}
