import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.ts'],
    setupFiles: ['test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: [...coverageConfigDefaults.exclude, 'src/**/*.fixture.ts'],
      reporter: ['text', 'text-summary'],
      // What the suite reaches today, rounded down: any drop fails the gate. Raise it, never lower it.
      thresholds: { statements: 96, branches: 89, functions: 93, lines: 97 },
    },
  },
});
