const COMMERCE_API_BASE = 'https://dummyjson.com';

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export interface BoUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  company?: { name?: string; title?: string };
}

export interface BoCart {
  id: number;
  userId: number;
  total: number;
  totalProducts?: number;
  totalQuantity?: number;
  products: Array<{ id: number; title: string; quantity: number; price: number }>;
}

export async function fetchUsers(limit = 30): Promise<BoUser[]> {
  const json = await getJson<{ users: BoUser[] }>(`${COMMERCE_API_BASE}/users?limit=${limit}`);
  return json.users;
}

export async function fetchCarts(limit = 20): Promise<BoCart[]> {
  const json = await getJson<{ carts: BoCart[] }>(`${COMMERCE_API_BASE}/carts?limit=${limit}`);
  return json.carts;
}
