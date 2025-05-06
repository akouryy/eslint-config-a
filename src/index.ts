// Partially forked from https://github.com/mightyiam/eslint-config-love

/* eslint-disable @typescript-eslint/no-magic-numbers -- Ignore magic numbers in configuration */

import { FlatCompat } from '@eslint/eslintrc'
import type { TSESLint } from '@typescript-eslint/utils'
import gitignore from 'eslint-config-flat-gitignore'
import love from 'eslint-config-love'
import type { plugin as importPlugin } from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react, { type ReactFlatConfig } from 'eslint-plugin-react'
import type { ESLintRules } from 'eslint/rules'
import tseslint from 'typescript-eslint'

type Rules = Partial<
  { [K in keyof ESLintRules as string extends K ? never : K]: ESLintRules[K] } & (typeof importPlugin)['rules'] &
    Record<
      `react/${keyof typeof react.configs.all.rules}` | `react-hooks/${string}` | `@typescript-eslint/${string}`,
      TSESLint.SharedConfig.RuleEntry
    >
>

export default Array<TSESLint.FlatConfig.Config>(
  gitignore(),
  { files: ['**/*.{c,m,}js{x,}', '**/*.tsx'] },
  {
    name: 'love',
    ...love,
  },
  {
    name: 'Disable rules with type information in JavaScript files',
    files: ['**/*.{c,m,}js{x,}'],
    ...tseslint.configs.disableTypeChecked,
  },
  jsxA11y.flatConfigs.recommended,
  /* eslint-disable @typescript-eslint/no-unsafe-type-assertion -- https://github.com/jsx-eslint/eslint-plugin-react/blob/244743a7a974787f60d0afb05dd2cae8f7392064/index.js#L106 */
  (react.configs.flat as { recommended: ReactFlatConfig }).recommended,
  (react.configs.flat as { 'jsx-runtime': ReactFlatConfig })['jsx-runtime'],
  /* eslint-enable @typescript-eslint/no-unsafe-type-assertion */
  ...new FlatCompat().extends('plugin:react-hooks/recommended'),
  {
    name: 'base settings',
    settings: {
      react: {
        // for Remix and shadcn/ui
        formComponents: ['Form'],
        linkComponents: [
          // for Remix
          { name: 'NavLink', linkAttribute: 'to' },
          { name: 'Link', linkAttribute: 'to' },
        ],
        version: 'detect',
      },
    },
  },

  // Overrides
  ...Array<TSESLint.FlatConfig.Config & { rules: Rules }>(
    {
      name: 'misc overrides',
      rules: {
        complexity: ['error', { max: 40, variant: 'modified' }],
        'import/no-relative-parent-imports': 'error',
        'max-nested-callbacks': ['error', {}],
        'react/button-has-type': 'error',
        'react/checked-requires-onchange-or-readonly': 'error',
        'react/hook-use-state': 'error',
        'react/iframe-missing-sandbox': 'error',
        'react/jsx-boolean-value': 'error',
        'react/jsx-curly-brace-presence': [
          'error',
          { props: 'never', children: 'never', propElementValues: 'never' },
        ],
        'react/jsx-fragments': 'error',
        'react/jsx-handler-names': 'error',
        'react/jsx-no-constructed-context-values': 'error',
        'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
        'react/prefer-stateless-function': 'error',
        'react/self-closing-comp': 'error',
        'react-hooks/exhaustive-deps': 'error',
      },
    },
    {
      name: 'TypeScript overrides',
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/consistent-indexed-object-style': 'off', // Too many unsafe fixess
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
            allowExpressions: true,
            allowIIFEs: true,
          },
        ],
        '@typescript-eslint/max-params': ['error', { max: 5 }],
        '@typescript-eslint/naming-convention': [
          'error',
          ...[
            { selector: ['variableLike', 'accessor', 'function'], format: ['camelCase', 'PascalCase'] },
            { selector: 'parameter', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
            {
              selector: 'variable',
              format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
              leadingUnderscore: 'allow',
            },
            { selector: ['typeLike', 'enumMember'], format: ['PascalCase'] },
            { selector: 'default', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
          ].map(rule => ({
            ...rule,
            filter: { regex: '^(unstable|v3)_|\\W', match: false },
          })),
        ],
        '@typescript-eslint/no-invalid-void-type': ['error', { allowAsThisParameter: true }],
        '@typescript-eslint/no-magic-numbers': [
          'error',
          {
            ignore: [-1, 0, 1, 2, 10, 12, 24, 36, 60, 100, 180, 360, 1000, 3600, 86400],
            ignoreArrayIndexes: true,
            detectObjects: true,
          },
        ],
        '@typescript-eslint/no-unsafe-function-type': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            reportUsedIgnorePattern: true,
            varsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/prefer-destructuring': [
          'error',
          {
            VariableDeclarator: { array: true, object: true },
            AssignmentExpression: { array: false, object: false },
          },
        ],
        'react/prop-types': 'off',
      },
    },
    {
      name: 'Next.js overrides',
      files: ['next-env.d.ts'],
      rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      name: 'Remix overrides',
      files: ['**/app/routes/*.tsx', '**/app/routes/*/route.tsx'],
      rules: {
        // Allow return types of loaders and actions to be inferred
        '@typescript-eslint/explicit-function-return-type': 'off',
        // Allow Responses to be thrown in loaders and actions
        '@typescript-eslint/only-throw-error': 'off',
      },
    },
  ),
)
