import type { LintResult } from 'standard-engine'

export function standardReporter (
  isUsingStdInAndFix: boolean
): (results: LintResult[]) => string {
  return (lintResults: LintResult[]): string => {
    const prefix = isUsingStdInAndFix ? 'ts-standard:' : ' '
    let logResults = ''
    lintResults.forEach((res) => {
      res.messages.forEach((msg) => {
        logResults +=
          prefix +
          ` ${res.filePath}:${msg.line?.toString(10) ?? '0'}:` +
          `${msg.column?.toString(10) ?? '0'}: ${msg.message}` +
          ` (${msg.ruleId ?? ''})\n`
      })
    })
    return logResults.slice(0, logResults.length - 1)
  }
}
