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
      // About two points under what the suite reaches, so a change that drops coverage fails.
      thresholds: { statements: 93, branches: 88, functions: 90, lines: 95 },
    },
  },
});
