import { describe, it, expect } from 'vitest';

// TDD: module not implemented yet
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidName,
} from '../validators';

describe('validators (TDD)', () => {
  it('validates email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('validates username (GitHub pattern)', () => {
    expect(isValidUsername('valid-user')).toBe(true);
    expect(isValidUsername('-bad')).toBe(false);
    expect(isValidUsername('bad-')).toBe(false);
    expect(isValidUsername('in--valid')).toBe(false);
  });

  it('validates password (min 8 + complexity)', () => {
    expect(isValidPassword('StrongPass123')).toBe(true);
    expect(isValidPassword('weak')).toBe(false);
  });

  it('validates name (letters, spaces, hyphens, apostrophes, dots)', () => {
    expect(isValidName("O'Connor")).toBe(true);
    expect(isValidName('John Doe')).toBe(true);
    expect(isValidName('John123')).toBe(false);
  });
});
