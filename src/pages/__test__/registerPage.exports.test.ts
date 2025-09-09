import { describe, it, expect } from 'vitest';

// TDD: component not implemented yet
import RegisterPage from '../RegisterPage';

describe('RegisterPage export (TDD)', () => {
  it('should export a function component', () => {
    expect(typeof RegisterPage).toBe('function');
  });
});
