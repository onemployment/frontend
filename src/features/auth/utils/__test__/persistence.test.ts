import { describe, it, expect } from 'vitest';

import {
  persistAuth,
  hydrateAuth,
  clearAuth,
  AUTH_STORAGE_KEY,
} from '../persistence';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const createMemoryStorage = (): StorageLike => {
  const store = new Map<string, string>();
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => void store.set(k, v),
    removeItem: (k) => void store.delete(k),
  };
};

const sample = {
  token: 'tkn',
  user: {
    id: '1',
    email: 'e@example.com',
    username: 'u',
    firstName: 'F',
    lastName: 'L',
    displayName: null,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  },
};

describe('persistence (TDD)', () => {
  it('persists auth state to storage under the configured key', () => {
    const storage = createMemoryStorage();
    persistAuth(storage, sample);
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed).toEqual(sample);
  });

  it('hydrates auth state from storage', () => {
    const storage = createMemoryStorage();
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sample));
    const hydrated = hydrateAuth(storage);
    expect(hydrated).toEqual(sample);
  });

  it('returns null when storage is missing or value is absent', () => {
    const storage = createMemoryStorage();
    const hydrated = hydrateAuth(storage);
    expect(hydrated).toBeNull();
  });

  it('handles malformed JSON gracefully and returns null', () => {
    const storage = createMemoryStorage();
    storage.setItem(AUTH_STORAGE_KEY, '{not-json');
    const hydrated = hydrateAuth(storage);
    expect(hydrated).toBeNull();
  });

  it('clears persisted auth state', () => {
    const storage = createMemoryStorage();
    persistAuth(storage, sample);
    clearAuth(storage);
    expect(storage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
