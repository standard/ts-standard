declare module 'eslint/lib/cli-engine/formatters/stylish' {
  import type { LintResult } from 'standard-engine'

  function stylish (results: LintResult[]): string
  namespace stylish {}
  export = stylish
}
