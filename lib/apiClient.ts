/**
 * Thin API client. All requests attach the JWT stored in the auth store.
 * BASE_URL can be overridden via EXPO_PUBLIC_API_URL in your .env
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ?? 'http://localhost:3000';

async function getToken(): Promise<string | null> {
  // Token is stored separately so we avoid a circular dependency with the auth store
  return AsyncStorage.getItem('auth_token');
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: unknown;
  skipAuth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, skipAuth = false }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path} → ${res.status}: ${text}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}
