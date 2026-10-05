import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/main.ts', 'src/**/*.test.ts'],
      reporter: ['text', 'text-summary'],
      // Two points under what the suite reaches, so a change that drops coverage fails.
      thresholds: { statements: 98, branches: 98, functions: 98, lines: 98 },
    },
  },
});
