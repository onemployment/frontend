type Deps = {
  logout: () => Promise<unknown>;
  navigate: (path: string) => void;
};

export function createLogoutHandler(deps: Deps) {
  return async (): Promise<void> => {
    try {
      await deps.logout();
    } catch (_e) {
      void _e; // ignore logout errors; proceed to navigate
    }
    deps.navigate('/login');
  };
}
