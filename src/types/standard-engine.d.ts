declare module 'standard-engine' {
  // Typing ported over from @types/eslint
  export type Severity = 0 | 1 | 2
  export interface LintMessage {
    column?: number
    line?: number
    endColumn?: number
    endLine?: number
    ruleId?: string
    message: string
    nodeType: string
    fatal?: true
    severity: Severity
    fix?: Object
    source?: string
  }

  export interface FixReport {
    fixed: boolean
    output: string
    messages: LintMessage[]
  }

  export interface LintResult {
    filePath: string
    messages: LintMessage[]
    errorCount: number
    warningCount: number
    fixableErrorCount: number
    fixableWarningCount: number
    output?: string
    source?: string
  }

  export interface LintReport {
    results: LintResult[]
    errorCount: number
    warningCount: number
    fixableErrorCount: number
    fixableWarningCount: number
  }
  // End eslint types porting

  export class linter {
    constructor (options: any)
    lintText (
      text: string,
      options: any,
      callback: (err?: Error, results?: LintReport) => void
    ): void
    lintFiles (
      files: string[],
      options: any,
      callback: (err?: Error, results?: LintReport) => void
    ): void
  }
}
