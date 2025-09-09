import { describe, it, expect } from 'vitest';

// Define a minimal User shape matching backend for test purposes
interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  emailVerified: boolean;
  accountCreationMethod: 'local' | 'google';
  createdAt: string;
  lastLoginAt: string | null;
}

// TDD: target module to implement
import {
  authReducer,
  setCredentials,
  clearCredentials,
  selectIsAuthenticated,
  selectCurrentUser,
  selectToken,
} from '../authSlice';
import type { AuthState } from '../authSlice';

const mockUser: User = {
  id: 'u1',
  email: 'test@example.com',
  username: 'tester',
  firstName: 'Test',
  lastName: 'User',
  displayName: null,
  emailVerified: false,
  accountCreationMethod: 'local',
  createdAt: new Date().toISOString(),
  lastLoginAt: null,
};

describe('authSlice (TDD)', () => {
  it('should initialize with null token and user', () => {
    const initialState = undefined as unknown as AuthState | undefined;
    const state = authReducer(initialState, {
      type: '@@INIT',
    } as unknown as never);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('should set credentials', () => {
    const state = authReducer(
      undefined,
      setCredentials({ token: 't1', user: mockUser })
    );
    expect(state.token).toBe('t1');
    expect(state.user).toEqual(mockUser);
  });

  it('should clear credentials', () => {
    const populated: AuthState = { token: 't1', user: mockUser };
    const state = authReducer(populated, clearCredentials());
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('selectors should reflect auth state', () => {
    const populated: AuthState = { token: 't1', user: mockUser };
    const empty: AuthState = { token: null, user: null };
    const rootPopulated = { auth: populated } as { auth: AuthState };
    const rootEmpty = { auth: empty } as { auth: AuthState };
    expect(selectIsAuthenticated(rootPopulated)).toBe(true);
    expect(selectIsAuthenticated(rootEmpty)).toBe(false);
    expect(selectCurrentUser(rootPopulated)).toEqual(mockUser);
    expect(selectCurrentUser(rootEmpty)).toBeNull();
    expect(selectToken(rootPopulated)).toBe('t1');
    expect(selectToken(rootEmpty)).toBeNull();
  });
});
