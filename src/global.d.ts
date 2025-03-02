declare module 'eslint-plugin-import' {
  import type { Linter, ESLint } from 'eslint'

  const plugin: Omit<ESLint.Plugin, 'rules'> & {
    rules: {
      'import/no-relative-parent-imports': Linter.RuleEntry<[]>
    }
  }
}
