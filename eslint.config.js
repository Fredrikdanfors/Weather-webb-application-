// ESLint configuration mirrors the default Vite React setup with Prettier alignment built in.
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    // Ignore build output so linting only targets source files.
    ignores: ['dist'],
  },
  // Start from the recommended JavaScript ruleset.
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      // Register browser globals like `window` and `document`.
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          // Enable JSX parsing.
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      // Enable React-specific linting rules.
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      // Auto-detect the installed React version to silence plugin warnings.
      react: { version: 'detect' },
    },
    rules: {
      // Pull in the recommended React and JSX runtime rules.
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // Ensure only React components are exported during fast refresh.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['tests/**/*.{js,jsx}'],
    languageOptions: {
      // Allow Vitest-provided globals within the test suite.
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
  // Prettier turns off stylistic ESLint rules so formatting stays single-sourced.
  eslintConfigPrettier,
]
