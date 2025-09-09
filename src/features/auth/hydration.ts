import { hydrateAuth, type Credentials } from './utils/persistence';

export type PreloadedAuthState = { token: string | null; user: unknown | null };

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function buildPreloadedAuthState(
  storage: StorageLike
): PreloadedAuthState {
  const creds: Credentials | null = hydrateAuth(storage);
  if (!creds) return { token: null, user: null };
  return { token: creds.token ?? null, user: creds.user ?? null };
}
