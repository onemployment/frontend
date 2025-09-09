import { describe, it, expect, vi } from 'vitest';

// TDD: controller not implemented yet
import { createLoginSubmit } from '../loginController';

describe('loginController (TDD)', () => {
  const makeDeps = () => {
    return {
      login:
        vi.fn<
          (body: { email: string; password: string }) => Promise<unknown>
        >(),
      navigate: vi.fn<(path: string) => void>(),
      setFieldErrors: vi.fn<(map: Record<string, string[]>) => void>(),
      setFormError: vi.fn<(msg: string) => void>(),
    };
  };

  it('validates input and reports field errors without calling login', async () => {
    const deps = makeDeps();
    const submit = createLoginSubmit(deps);
    await submit({ email: '', password: '' });

    expect(deps.login).not.toHaveBeenCalled();
    expect(deps.navigate).not.toHaveBeenCalled();
    expect(deps.setFieldErrors).toHaveBeenCalled();
  });

  it('navigates on successful login', async () => {
    const deps = makeDeps();
    deps.login.mockResolvedValue({ token: 't', user: {} });
    const submit = createLoginSubmit(deps);

    await submit({ email: 'user@example.com', password: 'StrongPass123' });

    expect(deps.login).toHaveBeenCalled();
    expect(deps.navigate).toHaveBeenCalledWith('/app');
    expect(deps.setFormError).not.toHaveBeenCalled();
  });

  it('maps 400 validation details to field errors', async () => {
    const deps = makeDeps();
    deps.login.mockRejectedValue({
      status: 400,
      data: {
        details: [{ field: 'email', message: 'Invalid email' }],
        message: 'Invalid request data',
      },
    });

    const submit = createLoginSubmit(deps);
    await submit({ email: 'bad', password: 'x' });

    expect(deps.setFieldErrors).toHaveBeenCalledWith({
      email: ['Invalid email'],
    });
    expect(deps.setFormError).toHaveBeenCalledWith('Invalid request data');
  });

  it('surfaces other errors as form error', async () => {
    const deps = makeDeps();
    deps.login.mockRejectedValue({
      status: 401,
      data: { message: 'Invalid email or password' },
    });
    const submit = createLoginSubmit(deps);
    await submit({ email: 'user@example.com', password: 'wrong' });
    expect(deps.setFormError).toHaveBeenCalledWith('Invalid email or password');
  });
});
