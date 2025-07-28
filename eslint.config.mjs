import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: ['@typescript-eslint', 'prettier'], // Adiciona o plugin Prettier
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended', // Usa as configurações recomendadas do Prettier
    ],
    env: {
      es2021: true,
      node: true,
    },
    rules: {
      'prettier/prettier': 'error', // Aplica a regra do Prettier como erro
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      '@typescript-eslint/no-empty-interface': 'off',
    },
  },
];
