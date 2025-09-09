import { describe, it, expect, vi } from 'vitest';

// TDD: controller not implemented yet
import { createRegisterSubmit } from '../registerController';

describe('registerController (TDD)', () => {
  const makeDeps = () => {
    return {
      register:
        vi.fn<
          (body: {
            email: string;
            password: string;
            username: string;
            firstName: string;
            lastName: string;
          }) => Promise<unknown>
        >(),
      navigate: vi.fn<(path: string) => void>(),
      setFieldErrors: vi.fn<(map: Record<string, string[]>) => void>(),
      setFormError: vi.fn<(msg: string) => void>(),
    };
  };

  it('validates input and reports field errors without calling register', async () => {
    const deps = makeDeps();
    const submit = createRegisterSubmit(deps);
    await submit({
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
    });

    expect(deps.register).not.toHaveBeenCalled();
    expect(deps.navigate).not.toHaveBeenCalled();
    expect(deps.setFieldErrors).toHaveBeenCalled();
  });

  it('navigates on successful registration', async () => {
    const deps = makeDeps();
    deps.register.mockResolvedValue({ token: 't', user: {} });
    const submit = createRegisterSubmit(deps);

    await submit({
      email: 'user@example.com',
      password: 'StrongPass123',
      username: 'valid-user',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(deps.register).toHaveBeenCalled();
    expect(deps.navigate).toHaveBeenCalledWith('/app');
    expect(deps.setFormError).not.toHaveBeenCalled();
  });

  it('maps 400 validation details to field errors', async () => {
    const deps = makeDeps();
    deps.register.mockRejectedValue({
      status: 400,
      data: {
        details: [{ field: 'email', message: 'Invalid email' }],
        message: 'Invalid request data',
      },
    });

    const submit = createRegisterSubmit(deps);
    await submit({
      email: 'bad',
      password: 'x',
      username: 'u',
      firstName: 'f',
      lastName: 'l',
    });

    expect(deps.setFieldErrors).toHaveBeenCalledWith({
      email: ['Invalid email'],
    });
    expect(deps.setFormError).toHaveBeenCalledWith('Invalid request data');
  });

  it('surfaces 409 email conflict as form error and field error', async () => {
    const deps = makeDeps();
    deps.register.mockRejectedValue({
      status: 409,
      data: {
        error: 'EMAIL_TAKEN',
        message: 'Email already registered. Please sign in instead',
      },
    });
    const submit = createRegisterSubmit(deps);
    await submit({
      email: 'dup@example.com',
      password: 'StrongPass123',
      username: 'u',
      firstName: 'f',
      lastName: 'l',
    });

    expect(deps.setFieldErrors).toHaveBeenCalledWith({
      email: ['Email already registered. Please sign in instead'],
    });
    expect(deps.setFormError).toHaveBeenCalledWith(
      'Email already registered. Please sign in instead'
    );
  });
});
