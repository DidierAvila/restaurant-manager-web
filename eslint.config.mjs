// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'dist/**',
      'build/**',
      'out/**',
      'node_modules/**',
      '.env*',
      '*.log',
      'coverage/**',
      'next.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'public/**',
      '*.tsbuildinfo',
      'swagger.json',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      // Permite console.warn y console.error sin advertencia; mantiene console.log como warning
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // No cortar el build por variables no usadas; permitir prefijo _ para ignorar
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Evitar falsos positivos en tipos inferrables en TSX
      '@typescript-eslint/no-inferrable-types': 'warn',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'],
    extends: [eslintPluginPrettierRecommended],
    rules: {
      ...eslintConfigPrettier.rules,
    },
  }
);
