import { describe, it, expect } from 'vitest';

// TDD: target module not implemented yet
import { buildPreloadedAuthState } from '../hydration';
import { AUTH_STORAGE_KEY } from '../utils/persistence';

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const memoryStorage = (): StorageLike => {
  const map = new Map<string, string>();
  return {
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
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

describe('buildPreloadedAuthState (TDD)', () => {
  it('returns empty state when storage has no auth', () => {
    const storage = memoryStorage();
    const state = buildPreloadedAuthState(storage);
    expect(state).toEqual({ token: null, user: null });
  });

  it('hydrates state from storage when available', () => {
    const storage = memoryStorage();
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sample));
    const state = buildPreloadedAuthState(storage);
    expect(state).toEqual({ token: sample.token, user: sample.user });
  });

  it('handles malformed JSON and returns empty state', () => {
    const storage = memoryStorage();
    storage.setItem(AUTH_STORAGE_KEY, '{bad-json');
    const state = buildPreloadedAuthState(storage);
    expect(state).toEqual({ token: null, user: null });
  });
});
