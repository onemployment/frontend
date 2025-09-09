import { describe, it, expect } from 'vitest';

// TDD: module not implemented yet
import { attachAuthHeader } from '../tokenHeader';

describe('attachAuthHeader (TDD)', () => {
  it('adds Authorization header when token present', () => {
    const headers = new Headers();
    attachAuthHeader(headers, 'abc');
    expect(headers.get('Authorization')).toBe('Bearer abc');
  });

  it('does not change headers when token is falsy', () => {
    const headers = new Headers();
    attachAuthHeader(headers, '');
    expect(headers.get('Authorization')).toBeNull();
  });
});
