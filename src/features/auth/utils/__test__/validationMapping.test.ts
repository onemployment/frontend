import { describe, it, expect } from 'vitest';

// TDD: module not implemented yet
import { collectFieldErrors, getFirstFieldError } from '../validationMapping';

describe('validationMapping (TDD)', () => {
  const details = [
    { field: 'email', message: 'Email is invalid' },
    { field: 'password', message: 'Password is required' },
    { field: 'password', message: 'Password must be at least 8 characters' },
  ];

  it('collects field errors into a dictionary of arrays', () => {
    const map = collectFieldErrors(details);
    expect(map.email).toEqual(['Email is invalid']);
    expect(map.password).toEqual([
      'Password is required',
      'Password must be at least 8 characters',
    ]);
  });

  it('returns first error for a field', () => {
    const map = collectFieldErrors(details);
    expect(getFirstFieldError('email', map)).toBe('Email is invalid');
    expect(getFirstFieldError('password', map)).toBe('Password is required');
    expect(getFirstFieldError('username', map)).toBeUndefined();
  });
});
