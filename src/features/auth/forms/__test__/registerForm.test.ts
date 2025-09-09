import { describe, it, expect } from 'vitest';

// TDD: module not implemented yet
import { sanitizeRegisterInput, validateRegisterInput } from '../registerForm';

describe('registerForm (TDD)', () => {
  it('sanitizes email (trim+lowercase), trims names/username; password unchanged', () => {
    const sanitized = sanitizeRegisterInput({
      email: '  USER@Example.Com  ',
      password: 'StrongPass123',
      username: '  user-name  ',
      firstName: '  John  ',
      lastName: '  Doe  ',
    });
    expect(sanitized).toEqual({
      email: 'user@example.com',
      password: 'StrongPass123',
      username: 'user-name',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('validates required fields and formats per design', () => {
    const base = {
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
    };
    const errors1 = validateRegisterInput(base);
    expect(errors1.email?.[0]).toBeDefined();
    expect(errors1.password?.[0]).toBeDefined();
    expect(errors1.username?.[0]).toBeDefined();
    expect(errors1.firstName?.[0]).toBeDefined();
    expect(errors1.lastName?.[0]).toBeDefined();

    const bad = {
      email: 'not-an-email',
      password: 'weak',
      username: '-bad-username-',
      firstName: 'John123',
      lastName: 'Doe@',
    };
    const errors2 = validateRegisterInput(bad);
    expect(errors2.email?.[0]).toBeDefined();
    expect(errors2.password?.[0]).toBeDefined();
    expect(errors2.username?.[0]).toBeDefined();
    expect(errors2.firstName?.[0]).toBeDefined();
    expect(errors2.lastName?.[0]).toBeDefined();

    const good = {
      email: 'user@example.com',
      password: 'StrongPass123',
      username: 'valid-user',
      firstName: "O'Connor",
      lastName: 'Smith-Jones',
    };
    const errors3 = validateRegisterInput(good);
    expect(errors3).toEqual({});
  });
});
