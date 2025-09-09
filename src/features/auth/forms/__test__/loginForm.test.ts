import { describe, it, expect } from 'vitest';

// TDD: module not implemented yet
import { sanitizeLoginInput, validateLoginInput } from '../loginForm';

describe('loginForm (TDD)', () => {
  it('sanitizes email (trim + lowercase) and keeps password intact', () => {
    const sanitized = sanitizeLoginInput({
      email: '  USER@Example.Com  ',
      password: 'Pass123',
    });
    expect(sanitized).toEqual({
      email: 'user@example.com',
      password: 'Pass123',
    });
  });

  it('validates required fields and formats', () => {
    const errors1 = validateLoginInput({ email: '', password: '' });
    expect(errors1.email?.[0]).toBeDefined();
    expect(errors1.password?.[0]).toBeDefined();

    const errors2 = validateLoginInput({
      email: 'not-an-email',
      password: 'something',
    });
    expect(errors2.email?.[0]).toBeDefined();

    const errors3 = validateLoginInput({
      email: 'user@example.com',
      password: 'OkPass1',
    });
    expect(errors3).toEqual({});
  });
});
