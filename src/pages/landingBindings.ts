import { createLogoutHandler } from '../features/auth/controllers/logoutController';
import { selectCurrentUser } from '../features/auth/authSlice';
import type { AuthState } from '../features/auth/authSlice';

type Deps<State> = {
  getState: () => State;
  logout: () => Promise<unknown>;
  navigate: (path: string) => void;
};

export function createLandingBindings<State>(deps: Deps<State>) {
  const state = deps.getState();
  const currentUser = selectCurrentUser(state as { auth: AuthState });

  const handleLogout = createLogoutHandler({
    logout: deps.logout,
    navigate: deps.navigate,
  });

  return { currentUser, handleLogout };
}
