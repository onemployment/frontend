import { describe, it, expect } from 'vitest';

// TDD: ensure main exports RootApp wrapper used for routing
import { RootApp } from '../main';

describe('main RootApp export (TDD)', () => {
  it('should export a function component', () => {
    expect(typeof RootApp).toBe('function');
  });
});
