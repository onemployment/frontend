import { describe, it, expect, vi } from 'vitest';

// TDD: binding not implemented yet
import { createLandingBindings } from '../landingBindings';

type User = { id: string; username: string } & Record<string, unknown>;
type RootState = { auth: { token: string | null; user: User | null } };

const makeState = (user: User | null): RootState => ({
  auth: { token: user ? 't' : null, user },
});

describe('createLandingBindings (TDD)', () => {
  it('returns current user from Redux state', () => {
    const user = { id: '1', username: 'alice' } as User;
    const bindings = createLandingBindings({
      getState: () => makeState(user),
      logout: vi.fn().mockResolvedValue({}),
      navigate: vi.fn(),
    });
    expect(bindings.currentUser).toEqual(user);
  });

  it('handleLogout calls logout and navigates to /login', async () => {
    const logout = vi.fn().mockResolvedValue({});
    const navigate = vi.fn();
    const bindings = createLandingBindings({
      getState: () => makeState({ id: '1', username: 'a' } as User),
      logout,
      navigate,
    });
    await bindings.handleLogout();
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
