import {
  sanitizeRegisterInput,
  type RegisterInput,
} from '../forms/registerForm';
import { collectFieldErrors } from '../utils/validationMapping';

type Deps = {
  register: (body: RegisterInput) => Promise<unknown>;
  navigate: (path: string) => void;
  setFieldErrors: (map: Record<string, string[]>) => void;
  setFormError: (msg: string) => void;
};

export function createRegisterSubmit(deps: Deps) {
  return async (input: RegisterInput): Promise<void> => {
    deps.setFieldErrors({});

    const sanitized = sanitizeRegisterInput(input);
    const presenceErrors: Record<string, string[]> = {};
    if (!sanitized.email) presenceErrors.email = ['Email is required'];
    if (!sanitized.password) presenceErrors.password = ['Password is required'];
    if (!sanitized.username) presenceErrors.username = ['Username is required'];
    if (!sanitized.firstName)
      presenceErrors.firstName = ['First name is required'];
    if (!sanitized.lastName)
      presenceErrors.lastName = ['Last name is required'];
    if (Object.keys(presenceErrors).length > 0) {
      deps.setFieldErrors(presenceErrors);
      return;
    }

    try {
      await deps.register(sanitized);
      deps.navigate('/app');
    } catch (err: unknown) {
      const e = err as {
        status?: number;
        data?: { details?: unknown; message?: unknown; error?: string };
      };
      if (e?.status === 400 && Array.isArray(e?.data?.details)) {
        deps.setFieldErrors(
          collectFieldErrors(
            e.data.details as Array<{ field: string; message: string }>
          )
        );
      }
      if (e?.status === 409 && e?.data?.message) {
        const msg = String(e.data.message);
        if (e?.data?.error === 'EMAIL_TAKEN') {
          deps.setFieldErrors({ email: [msg] });
        } else if (e?.data?.error === 'USERNAME_TAKEN') {
          deps.setFieldErrors({ username: [msg] });
        }
        deps.setFormError(msg);
        return;
      }
      const msg =
        (e?.data as { message?: unknown })?.message || 'Registration failed';
      deps.setFormError(String(msg));
    }
  };
}
