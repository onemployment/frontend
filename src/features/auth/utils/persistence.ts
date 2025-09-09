export const AUTH_STORAGE_KEY = 'onemployment:auth';

export interface Credentials {
  token: string;
  user: unknown; // Keep generic here; slice defines concrete type
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function persistAuth(storage: StorageLike, creds: Credentials): void {
  try {
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(creds));
  } catch {
    // Swallow to avoid crashing on quota or serialization issues
  }
}

export function hydrateAuth(storage: StorageLike): Credentials | null {
  try {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Credentials;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!('token' in parsed) || !('user' in parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearAuth(storage: StorageLike): void {
  try {
    storage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}
