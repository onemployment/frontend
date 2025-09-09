import { describe, it, expect } from 'vitest';

// TDD: module not implemented yet
import { createAuthedBaseQuery } from '../baseQuery.util';

type AuthState = { token: string | null; user: unknown | null };
type RootState = { auth: AuthState };

const makeState = (token: string | null): RootState => ({
  auth: { token, user: null },
});

describe('createAuthedBaseQuery (TDD)', () => {
  it('exposes a prepareHeaders that applies Authorization when token exists', () => {
    const { prepareHeaders } = createAuthedBaseQuery<RootState>({
      baseUrl: 'http://localhost:3000',
      selectToken: (s) => s.auth.token,
    });

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const ctx = { getState: () => makeState('tok') } as {
      getState: () => RootState;
    };
    const result = prepareHeaders(headers, ctx);
    expect(result.get('Authorization')).toBe('Bearer tok');
    expect(result.get('Content-Type')).toBe('application/json');
  });

  it('leaves headers without Authorization when token is missing', () => {
    const { prepareHeaders } = createAuthedBaseQuery<RootState>({
      baseUrl: 'http://localhost:3000',
      selectToken: (s) => s.auth.token,
    });

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const ctx = { getState: () => makeState(null) } as {
      getState: () => RootState;
    };
    const result = prepareHeaders(headers, ctx);
    expect(result.get('Authorization')).toBeNull();
    expect(result.get('Content-Type')).toBe('application/json');
  });
});
