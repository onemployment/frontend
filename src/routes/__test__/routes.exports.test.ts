import { describe, it, expect } from 'vitest';

// TDD: routes module not implemented yet
import { AppRoutes } from '../index';

describe('AppRoutes export (TDD)', () => {
  it('should export a function component', () => {
    expect(typeof AppRoutes).toBe('function');
  });
});
