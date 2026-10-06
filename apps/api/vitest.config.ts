import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/main.ts', 'src/**/*.test.ts'],
      reporter: ['text', 'text-summary'],
      // The API is fully covered: any untested line fails the gate.
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
  },
});
