import { describe, it, expect } from 'vitest';

// TDD: component not implemented yet
import LoginPage from '../LoginPage';

describe('LoginPage export (TDD)', () => {
  it('should export a function component', () => {
    expect(typeof LoginPage).toBe('function');
  });
});
