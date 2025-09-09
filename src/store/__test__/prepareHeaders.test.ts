import { describe, it, expect } from 'vitest';

// TDD: this module doesn't exist yet
import { createPrepareHeaders } from '../prepareHeaders';

type AuthState = { token: string | null; user: unknown | null };
type RootState = { auth: AuthState };

const makeState = (token: string | null): RootState => ({
  auth: { token, user: null },
});

describe('createPrepareHeaders (TDD)', () => {
  it('does not set Authorization when token is missing', () => {
    const prepare = createPrepareHeaders<RootState>((s) => s.auth.token);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const ctx = { getState: () => makeState(null) } as {
      getState: () => RootState;
    };
    const result = prepare(headers, ctx);
    expect(result.get('Authorization')).toBeNull();
    expect(result.get('Content-Type')).toBe('application/json');
  });

  it('sets Authorization when token is present', () => {
    const prepare = createPrepareHeaders<RootState>((s) => s.auth.token);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const ctx = { getState: () => makeState('tok') } as {
      getState: () => RootState;
    };
    const result = prepare(headers, ctx);
    expect(result.get('Authorization')).toBe('Bearer tok');
    expect(result.get('Content-Type')).toBe('application/json');
  });
});
