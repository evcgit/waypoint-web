import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'build',
      '.pnp.loader.mjs',
      '.pnp.cjs',
      'yarn.lock',
      'vite.config.js'
    ]
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      jest,
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
      'react-compiler': reactCompiler
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': ['error'],
      'no-underscore-dangle': 'off',
      'no-console': ['error', { allow: ['warn', 'error', 'table'] }],
      'no-unused-vars': ['warn', { caughtErrors: 'none' }],
      'react/jsx-props-no-spreading': ['warn', { custom: 'ignore' }],
      'react-compiler/react-compiler': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'global-require': 'off',
      'class-methods-use-this': 'off',
      'no-useless-catch': 'off',
      'no-unused-expressions': 'off',
      'no-case-declarations': 'off',
      'no-shadow': 'off',
      'no-else-return': 'off',
      'no-plusplus': 'off',
      'no-nested-ternary': 'off',
      'import/no-cycle': 'off',
      'react/jsx-filename-extension': 'off',
      'react/prop-types': 'off',
      'react/destructuring-assignment': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/jsx-no-target-blank': 'off',
      'jsx-a11y/alt-text': 'off',
      'react/forbid-prop-types': 'off',
      'react/no-array-index-key': 'off',
      'no-restricted-syntax': 'off',
      'consistent-return': 'off',
      camelcase: 'off',
      radix: 'off',
      'array-callback-return': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['draft']
        }
      ],
      'react-hooks/exhaustive-deps': 'off'
    }
  }
];
