import * as cliLib from './cli'
import { cli, lintFiles, lintStdIn, printReport } from './cli'
import * as standardReporterLib from './standard-reporter'
import * as stylish from 'eslint/lib/cli-engine/formatters/stylish'
import * as getStdin from 'get-stdin'
import * as optionsLib from './options'

jest.mock('eslint/lib/cli-engine/formatters/stylish')
jest.mock('get-stdin')
const mockCustomReporter = jest.fn()
jest.mock('custom-reporter', () => mockCustomReporter, { virtual: true })
jest.mock('custom-bad-reporter', () => undefined, { virtual: true })

const mockStylish = stylish as jest.MockedFunction<typeof stylish>
const mockGetStdin = getStdin as jest.MockedFunction<typeof getStdin>
const mockProcess = process

describe('cli', () => {
  describe('printReport', () => {
    it('should use `standard` reporter to print the lint report to console', async (): Promise<void> => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      const reporterSpy = jest.fn()
      const standardReporterSpy = jest.spyOn(standardReporterLib, 'standardReporter').mockReturnValue(reporterSpy)
      await printReport({
        results: [{
          filePath: '/some/path',
          messages: [{
            column: 1,
            line: 1,
            endColumn: 2,
            endLine: 2,
            ruleId: 'custom-rule',
            message: 'lint error',
            fatal: true,
            severity: 0
          }],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0
        }]
      }, {
        report: 'standard',
        useStdIn: false,
        fix: false
      })

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(standardReporterSpy).toHaveBeenCalledTimes(1)
      expect(standardReporterSpy.mock.calls[0][0]).toEqual(false)
      expect(reporterSpy).toHaveBeenCalledTimes(1)
      expect(reporterSpy.mock.calls[0][0]).toHaveLength(1)
    })

    it('should print fixable message if `fix` option not provided and errors are fixable', async (): Promise<void> => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      await printReport({
        results: [{
          filePath: '/some/path',
          messages: [{
            column: 1,
            line: 1,
            endColumn: 2,
            endLine: 2,
            ruleId: 'custom-rule',
            message: 'lint error',
            fatal: true,
            severity: 0,
            fix: false
          }],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 1,
          fixableWarningCount: 0
        }]
      }, {
        report: 'standard',
        useStdIn: false,
        fix: false
      })
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    it('should not print fixable message if no errors are fixable', async (): Promise<void> => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      await printReport({
        results: [{
          filePath: '/some/path',
          messages: [{
            column: 1,
            line: 1,
            endColumn: 2,
            endLine: 2,
            ruleId: 'custom-rule',
            message: 'lint error',
            fatal: true,
            severity: 0
          }],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0
        }]
      }, {
        report: 'standard',
        useStdIn: false,
        fix: false
      })
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    it('should log lint errors to stderror if stdin was used and fix is enabled', async (): Promise<void> => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      await printReport({
        results: [{
          filePath: '/some/path',
          messages: [{
            column: 1,
            line: 1,
            endColumn: 2,
            endLine: 2,
            ruleId: 'custom-rule',
            message: 'lint error',
            fatal: true,
            severity: 0
          }],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0
        }]
      }, {
        report: 'standard',
        useStdIn: true,
        fix: true
      })

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
      expect(consoleLogSpy).toHaveBeenCalledTimes(0)
    })

    it('should use eslint built-in `stylish` reporter', async (): Promise<void> => {
      jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      mockStylish.mockReturnValue('')
      await printReport({
        results: [{
          filePath: '/some/path',
          messages: [{
            column: 1,
            line: 1,
            endColumn: 2,
            endLine: 2,
            ruleId: 'custom-rule',
            message: 'lint error',
            fatal: true,
            severity: 0
          }],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0
        }]
      }, {
        report: 'stylish',
        useStdIn: false,
        fix: false
      })
      expect(mockStylish).toHaveBeenCalledTimes(1)
    })

    it('should use custom lint reporter', async (): Promise<void> => {
      jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      await printReport({
        results: [{
          filePath: '/some/path',
          messages: [{
            column: 1,
            line: 1,
            endColumn: 2,
            endLine: 2,
            ruleId: 'custom-rule',
            message: 'lint error',
            fatal: true,
            severity: 0
          }],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0
        }]
      }, {
        report: 'custom-reporter',
        useStdIn: false,
        fix: false
      })
      expect(mockCustomReporter).toHaveBeenCalledTimes(1)
    })

    it('should throw error if custom lint reporter not found', async (): Promise<void> => {
      jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      expect.assertions(1)
      try {
        await printReport({
          results: [{
            filePath: '/some/path',
            messages: [{
              column: 1,
              line: 1,
              endColumn: 2,
              endLine: 2,
              ruleId: 'custom-rule',
              message: 'lint error',
              fatal: true,
              severity: 0
            }],
            errorCount: 1,
            warningCount: 0,
            fixableErrorCount: 0,
            fixableWarningCount: 0
          }]
        }, {
          report: 'bad-custom-reporter',
          useStdIn: false,
          fix: false
        })
      } catch (e) {
        expect(e.message).toMatch(/cannot find/gi)
      }
    })

    it('should throw error if custom lint reporter import returns undefined', async (): Promise<void> => {
      jest.spyOn(console, 'log').mockImplementation((() => undefined) as any)
      jest.spyOn(console, 'error').mockImplementation((() => undefined) as any)
      expect.assertions(1)
      try {
        await printReport({
          results: [{
            filePath: '/some/path',
            messages: [{
              column: 1,
              line: 1,
              endColumn: 2,
              endLine: 2,
              ruleId: 'custom-rule',
              message: 'lint error',
              fatal: true,
              severity: 0
            }],
            errorCount: 1,
            warningCount: 0,
            fixableErrorCount: 0,
            fixableWarningCount: 0
          }]
        }, {
          report: 'custom-bad-reporter',
          useStdIn: false,
          fix: false
        })
      } catch (e) {
        expect(e.message).toMatch(/import custom/gi)
      }
    })
  })

  describe('lintFiles', () => {
    it('should execute `lintFiles` with the given files on the provided linter', async (): Promise<void> => {
      const mockLinter = { lintFiles: jest.fn() }
      mockLinter.lintFiles.mockResolvedValue('linted!')
      const options = { files: ['some/file.ts'] }
      const res = await lintFiles(mockLinter as any, options)

      expect(mockLinter.lintFiles).toHaveBeenCalledTimes(1)
      expect(mockLinter.lintFiles).toHaveBeenCalledWith(options.files)
      expect(res).toEqual('linted!')
    })

    it('should log error and exit with code 1 if `lintFiles` fails', async (): Promise<void> => {
      const mockLinter = { lintFiles: jest.fn() }
      mockLinter.lintFiles.mockRejectedValue(new Error('Bad lint!'))
      const options = { files: ['some/file.ts'] }
      const consoleErrorSpy = jest.spyOn(console, 'error').mockReturnValue()
      const exitSpy = jest.spyOn(mockProcess, 'exit').mockImplementation((() => undefined) as any)
      await lintFiles(mockLinter as any, options)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(3)
      expect(exitSpy).toHaveBeenCalledTimes(1)
      expect(exitSpy).toHaveBeenCalledWith(1)
      expect(mockLinter.lintFiles).toHaveBeenCalledTimes(1)
      expect(mockLinter.lintFiles).toHaveBeenCalledWith(options.files)
    })
  })

  describe('lintStdIn', () => {
    it('should execute `lintText` with the given stdin text on the provided linter',
      async (): Promise<void> => {
        const stdinText = 'I am stdin text!'
        mockGetStdin.mockResolvedValueOnce(stdinText)

        const mockLinter = { lintText: jest.fn() }
        mockLinter.lintText.mockResolvedValue('linted!')

        const options = { fix: false }
        const res = await lintStdIn(mockLinter as any, options)

        expect(mockLinter.lintText).toHaveBeenCalledTimes(1)
        expect(mockLinter.lintText).toHaveBeenCalledWith(stdinText)

        expect(res).toEqual('linted!')
      }
    )

    it('should write the fixed output to stdout', async (): Promise<void> => {
      const stdinText = 'I am stdin text!'
      mockGetStdin.mockResolvedValueOnce(stdinText)

      const mockLinter = { lintText: jest.fn() }
      const lintReport = {
        results: [{ output: 'linted!' }]
      }
      mockLinter.lintText.mockResolvedValue(lintReport)

      const stdoutSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true)

      const options = { fix: true }
      const res = await lintStdIn(mockLinter as any, options)

      expect(mockLinter.lintText).toHaveBeenCalledTimes(1)
      expect(mockLinter.lintText).toHaveBeenCalledWith(stdinText)

      expect(res).toEqual(lintReport)

      expect(stdoutSpy).toHaveBeenCalledTimes(1)
      expect(stdoutSpy).toHaveBeenCalledWith('linted!')
    })

    it('should write the original input to stdout if nothing fixed', async (): Promise<void> => {
      const stdinText = 'I am stdin text!'
      mockGetStdin.mockResolvedValueOnce(stdinText)

      const mockLinter = { lintText: jest.fn() }
      const lintResults = {
        results: [{ output: undefined }]
      }
      mockLinter.lintText.mockResolvedValue(lintResults)

      const stdoutSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true)

      const options = { fix: true }
      const res = await lintStdIn(mockLinter as any, options)

      expect(mockLinter.lintText).toHaveBeenCalledTimes(1)
      expect(mockLinter.lintText).toHaveBeenCalledWith(stdinText)

      expect(res).toEqual(lintResults)

      expect(stdoutSpy).toHaveBeenCalledTimes(1)
      expect(stdoutSpy).toHaveBeenCalledWith(stdinText)
    })

    it('should log error and exit with code 1 if `lintText` fails', async (): Promise<void> => {
      const stdinText = 'I am stdin text!'
      mockGetStdin.mockResolvedValueOnce(stdinText)

      const mockLinter = { lintText: jest.fn() }
      mockLinter.lintText.mockRejectedValue(new Error('Bad lint!'))

      const consoleErrorSpy = jest.spyOn(console, 'error').mockReturnValue()
      const exitSpy = jest.spyOn(mockProcess, 'exit').mockImplementation((() => undefined) as any)

      const options = { fix: true }
      await lintStdIn(mockLinter as any, options)

      expect(mockLinter.lintText).toHaveBeenCalledTimes(1)
      expect(mockLinter.lintText).toHaveBeenCalledWith(stdinText)

      expect(consoleErrorSpy).toHaveBeenCalledTimes(3)
      expect(exitSpy).toHaveBeenCalledTimes(1)
      expect(exitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('cli', () => {
    it('should log error if no project provided',
      async (): Promise<void> => {
        jest.spyOn(optionsLib, 'getDefaultOptions').mockReturnValue({} as any)
        jest.spyOn(optionsLib, 'getPackageOptions').mockReturnValue({} as any)
        jest.spyOn(optionsLib, 'getCLIOptions').mockReturnValue({} as any)

        const consoleErrorSpy = jest.spyOn(console, 'error').mockReturnValue()
        const exitSpy = jest.spyOn(mockProcess, 'exit').mockImplementation((() => undefined) as any)

        await cli()

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledWith(1)
      }
    )

    it('should call `lintStdIn` function if `useStdIn` option provided and exit with code 0 if no errors/warnings',
      async (): Promise<void> => {
        jest.spyOn(optionsLib, 'getDefaultOptions').mockReturnValue({ project: '/project/location.json' } as any)
        jest.spyOn(optionsLib, 'getPackageOptions').mockReturnValue({} as any)
        jest.spyOn(optionsLib, 'getCLIOptions').mockReturnValue({ useStdIn: true } as any)

        const lintStdInSpy = jest.spyOn(cliLib, 'lintStdIn').mockResolvedValue({
          errorCount: 0,
          warningCount: 0
        } as any)

        const exitSpy = jest.spyOn(mockProcess, 'exit').mockImplementation((() => undefined) as any)

        await cli()

        expect(lintStdInSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledWith(0)
      }
    )

    it('should call `lintFiles` function and `printReport` and exit with code 1 if errors found',
      async (): Promise<void> => {
        jest.spyOn(optionsLib, 'getDefaultOptions').mockReturnValue({ project: '/project/location.json' } as any)
        jest.spyOn(optionsLib, 'getPackageOptions').mockReturnValue({} as any)
        jest.spyOn(optionsLib, 'getCLIOptions').mockReturnValue({} as any)

        const lintFilesSpy = jest.spyOn(cliLib, 'lintFiles').mockResolvedValue({
          errorCount: 1,
          warningCount: 1
        } as any)
        const printReportSpy = jest.spyOn(cliLib, 'printReport').mockResolvedValueOnce()
        const exitSpy = jest.spyOn(mockProcess, 'exit').mockImplementation((() => undefined) as any)

        await cli()

        expect(lintFilesSpy).toHaveBeenCalledTimes(1)
        expect(printReportSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledWith(1)
      }
    )

    it('should call `lintFiles` function and `printReport` and exit with code 0 if only warnings found',
      async (): Promise<void> => {
        jest.spyOn(optionsLib, 'getDefaultOptions').mockReturnValue({ project: '/project/location.json' } as any)
        jest.spyOn(optionsLib, 'getPackageOptions').mockReturnValue({} as any)
        jest.spyOn(optionsLib, 'getCLIOptions').mockReturnValue({} as any)

        const lintFilesSpy = jest.spyOn(cliLib, 'lintFiles').mockResolvedValue({
          errorCount: 0,
          warningCount: 1
        } as any)
        const printReportSpy = jest.spyOn(cliLib, 'printReport').mockResolvedValueOnce()
        const exitSpy = jest.spyOn(mockProcess, 'exit').mockImplementation((() => undefined) as any)

        await cli()

        expect(lintFilesSpy).toHaveBeenCalledTimes(1)
        expect(printReportSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledTimes(1)
        expect(exitSpy).toHaveBeenCalledWith(0)
      }
    )
  })
})
