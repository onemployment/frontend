import { describe, it, expect } from 'vitest';

// TDD: module not implemented yet
import { shouldClearAuthOnUnauthorized } from '../errorHandling';

type ErrorLike = { status?: number; data?: unknown };

describe('shouldClearAuthOnUnauthorized (TDD)', () => {
  it('returns true for 401 with TOKEN_EXPIRED message', () => {
    const err: ErrorLike = {
      status: 401,
      data: { error: 'TOKEN_EXPIRED', message: 'Token expired' },
    };
    expect(shouldClearAuthOnUnauthorized(err)).toBe(true);
  });

  it('returns true for 401 with INVALID_TOKEN', () => {
    const err: ErrorLike = {
      status: 401,
      data: { error: 'INVALID_TOKEN', message: 'Invalid token' },
    };
    expect(shouldClearAuthOnUnauthorized(err)).toBe(true);
  });

  it('returns true for 401 with generic unauthorized', () => {
    const err: ErrorLike = { status: 401, data: { message: 'Unauthorized' } };
    expect(shouldClearAuthOnUnauthorized(err)).toBe(true);
  });

  it('returns false for 429 rate limit', () => {
    const err: ErrorLike = {
      status: 429,
      data: { error: 'RATE_LIMIT_EXCEEDED' },
    };
    expect(shouldClearAuthOnUnauthorized(err)).toBe(false);
  });

  it('returns false for 400/409 validation/conflict', () => {
    expect(shouldClearAuthOnUnauthorized({ status: 400 })).toBe(false);
    expect(shouldClearAuthOnUnauthorized({ status: 409 })).toBe(false);
  });
});
