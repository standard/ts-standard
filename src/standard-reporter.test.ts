import { standardReporter } from './standard-reporter'

describe('standard-reporter', () => {
  describe('standardReporter', () => {
    it('return a formatted string containing the lint results in standardjs output format', () => {
      const res = standardReporter(false)([
        {
          filePath: '/some/path',
          messages: [
            {
              column: 1,
              line: 1,
              endColumn: 2,
              endLine: 2,
              ruleId: 'custom-rule',
              message: 'lint error',
              fatal: true,
              severity: 0,
              nodeType: 'test'
            }
          ],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0
        }
      ])
      expect(res).toEqual('  /some/path:1:1: lint error (custom-rule)')
    })

    it('return a formatted string containing multiple lint results in standardjs output format', () => {
      const res = standardReporter(false)([
        {
          filePath: '/some/path',
          messages: [
            {
              column: 1,
              line: 1,
              endColumn: 2,
              endLine: 2,
              ruleId: 'custom-rule',
              message: 'lint error',
              fatal: true,
              severity: 0,
              nodeType: 'test'
            },
            {
              column: 21,
              line: 35,
              endColumn: 10,
              endLine: 36,
              ruleId: 'other-rule',
              message: 'another lint error',
              fatal: undefined,
              severity: 2,
              nodeType: 'test'
            }
          ],
          errorCount: 1,
          warningCount: 1,
          fixableErrorCount: 1,
          fixableWarningCount: 0
        },
        {
          filePath: '/some-other/path',
          messages: [
            {
              column: 4,
              line: 16,
              endColumn: 2,
              endLine: 2,
              ruleId: 'other-custom-rule',
              message: 'other lint error',
              fatal: undefined,
              severity: 1,
              nodeType: 'test'
            }
          ],
          errorCount: 0,
          warningCount: 1,
          fixableErrorCount: 0,
          fixableWarningCount: 1
        }
      ])
      expect(res).toEqual(
        `  /some/path:1:1: lint error (custom-rule)
  /some/path:35:21: another lint error (other-rule)
  /some-other/path:16:4: other lint error (other-custom-rule)`
      )
    })

    it('when using stdin and fix, should prefix each lint message', () => {
      const res = standardReporter(true)([
        {
          filePath: '/some/path',
          messages: [
            {
              column: 1,
              line: 1,
              endColumn: 2,
              endLine: 2,
              ruleId: 'custom-rule',
              message: 'lint error',
              fatal: true,
              severity: 0,
              nodeType: 'test'
            },
            {
              column: 21,
              line: 35,
              endColumn: 10,
              endLine: 36,
              ruleId: 'other-rule',
              message: 'another lint error',
              fatal: undefined,
              severity: 2,
              nodeType: 'test'
            }
          ],
          errorCount: 1,
          warningCount: 1,
          fixableErrorCount: 1,
          fixableWarningCount: 0
        },
        {
          filePath: '/some-other/path',
          messages: [
            {
              message: 'other lint error',
              fatal: undefined,
              severity: 1,
              nodeType: 'test2'
            }
          ],
          errorCount: 0,
          warningCount: 1,
          fixableErrorCount: 0,
          fixableWarningCount: 1
        }
      ])
      expect(res).toEqual(
        `ts-standard: /some/path:1:1: lint error (custom-rule)
ts-standard: /some/path:35:21: another lint error (other-rule)
ts-standard: /some-other/path:0:0: other lint error ()`
      )
    })
  })
})
