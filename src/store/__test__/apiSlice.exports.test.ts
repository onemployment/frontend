import { describe, it, expect } from 'vitest';

// TDD: ensure new hooks are exported from apiSlice (no runtime invocation)
import {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useValidateEmailQuery,
  useValidateUsernameQuery,
  useSuggestUsernamesQuery,
} from '../apiSlice';

describe('apiSlice exports (TDD)', () => {
  it('exposes expected hooks for auth flows and validations', () => {
    expect(typeof useRegisterMutation).toBe('function');
    expect(typeof useLoginMutation).toBe('function');
    expect(typeof useLogoutMutation).toBe('function');
    expect(typeof useGetCurrentUserQuery).toBe('function');
    expect(typeof useValidateEmailQuery).toBe('function');
    expect(typeof useValidateUsernameQuery).toBe('function');
    expect(typeof useSuggestUsernamesQuery).toBe('function');
  });
});
