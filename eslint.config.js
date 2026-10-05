// @ts-check
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const WEB_FEATURES = 'apps/web/src/features';

export default defineConfig(
  {
    ignores: [
      '**/dist',
      '**/.next',
      '**/coverage',
      '.yarn',
      'apps/web/next-env.d.ts',
      '**/test-results',
      '**/playwright-report',
    ],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/api/**'],
    languageOptions: { globals: globals.node },
    rules: {
      // Nest wires classes by decorator; empty module classes are how it is written.
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    plugins: { '@next/next': nextPlugin },
    settings: { next: { rootDir: 'apps/web' } },
    languageOptions: { globals: globals.browser },
    rules: { ...nextPlugin.configs.recommended.rules, ...nextPlugin.configs['core-web-vitals'].rules },
  },
  {
    // The network, the contract DTOs and the 3D engine each have one home (docs/architecture.md).
    files: ['apps/web/src/**/*.{ts,tsx}'],
    ignores: ['apps/web/src/**/adapters/**', 'apps/web/src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-globals': ['error', { name: 'fetch', message: 'HTTP lives in adapters/.' }],
      'no-restricted-imports': [
        'error',
        { paths: [{ name: '@metaverso/contracts', message: 'Contract DTOs are mapped in adapters/.' }] },
      ],
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    ignores: [`${WEB_FEATURES}/world/ui/**`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: '@metaverso/contracts', message: 'Contract DTOs are mapped in adapters/.' }],
          patterns: [
            { group: ['three', 'three/*', '@react-three/*'], message: 'The 3D engine lives in features/world/ui.' },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/web/src/**/adapters/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['three', 'three/*', '@react-three/*'], message: 'The 3D engine lives in features/world/ui.' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/test/**', 'apps/web/e2e/**'],
    rules: {
      // Assertions on untyped JSON bodies and mocks read better without casts everywhere.
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  prettier,
);
