import { describe, it, expect } from 'vitest';

import { AppRoutes, ProtectedRoute } from '../index';

describe('AppRoutes export (TDD)', () => {
  it('should export a function component', () => {
    expect(typeof AppRoutes).toBe('function');
  });
});

describe('ProtectedRoute export', () => {
  it('should export a function component', () => {
    expect(typeof ProtectedRoute).toBe('function');
  });
});
