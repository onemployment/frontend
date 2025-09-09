import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__test__/**/*.test.ts'],
    globals: true,
    reporters: ['default'],
    coverage: {
      enabled: false,
    },
  },
});
