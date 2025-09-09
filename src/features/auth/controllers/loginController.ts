import { sanitizeLoginInput, type LoginInput } from '../forms/loginForm';
import { collectFieldErrors } from '../utils/validationMapping';

type Deps = {
  login: (body: { email: string; password: string }) => Promise<unknown>;
  navigate: (path: string) => void;
  setFieldErrors: (map: Record<string, string[]>) => void;
  setFormError: (msg: string) => void;
};

export function createLoginSubmit(deps: Deps) {
  return async (input: LoginInput): Promise<void> => {
    deps.setFieldErrors({});

    const sanitized = sanitizeLoginInput(input);

    const presenceErrors: Record<string, string[]> = {};
    if (!sanitized.email) presenceErrors.email = ['Email is required'];
    if (!sanitized.password) presenceErrors.password = ['Password is required'];
    if (Object.keys(presenceErrors).length > 0) {
      deps.setFieldErrors(presenceErrors);
      return;
    }

    try {
      await deps.login(sanitized);
      deps.navigate('/app');
    } catch (err: unknown) {
      const e = err as {
        status?: number;
        data?: { details?: unknown; message?: unknown };
      };
      if (e?.status === 400 && Array.isArray(e?.data?.details)) {
        deps.setFieldErrors(
          collectFieldErrors(
            e.data.details as Array<{ field: string; message: string }>
          )
        );
      }
      const msg =
        (e?.data as { message?: unknown })?.message || 'Sign in failed';
      deps.setFormError(String(msg));
    }
  };
}
