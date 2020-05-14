import type * as eslint from 'eslint'
import type { LintReport, LintResult } from 'standard-engine'
import * as getStdin from 'get-stdin'
import {
  getCLIOptions, getPackageOptions,
  getDefaultOptions, mergeOptions, CMD,
  DefaultOptions, TAGLINE
} from './options'
import { TSStandard } from './ts-standard'

export const ESLINT_BUILTIN_REPORTERS = [
  'stylish', 'checkstyle', 'codeframe', 'compact',
  'html', 'jslint-xml', 'json', 'junit', 'table',
  'tap', 'unix', 'visualstudio'
]

export interface Options {
  // Input methods
  files?: string[]
  test?: string
  stdIn?: boolean
  // Additional options
  project?: string
  fix?: boolean
  report?: string
  envs?: string[]
  ignore?: string[]
  noDefaultIgnore?: boolean
  globals?: string[]
  plugins?: string[]
  // Really advanced options
  parser?: string
  eslint?: typeof eslint
}

export async function cli (): Promise<void> {
  // Get the default/cli options
  const defaultOptions = getDefaultOptions()
  const packageOptions = getPackageOptions()
  const cliOptions = getCLIOptions()

  const options: DefaultOptions = mergeOptions(defaultOptions, packageOptions, cliOptions)

  // Linting requires a project file
  if (options.project == null) {
    console.error(
      'Unable to locate the project file. A project file (tsconfig.json or ' +
      'tsconfig.eslint.json) is required in order to use ts-standard.'
    )
    return process.exit(1)
  }

  const tsStandard = new TSStandard({
    project: options.project,
    fix: options.fix,
    ignore: options.ignore,
    noDefaultIgnore: options.noDefaultIgnore,
    envs: options.envs,
    globals: options.globals,
    plugins: options.plugins,
    parser: options.parser,
    eslint: options.eslint,
    cwd: options.cwd
  })

  // Perform the lint operation on the given files or text
  let lintReport: LintReport
  if (options.useStdIn) {
    lintReport = await exports.lintStdIn(tsStandard, options)
  } else {
    lintReport = await exports.lintFiles(tsStandard, options)
  }

  // If no errors or warnings return success
  if (lintReport.errorCount === 0 && lintReport.warningCount === 0) {
    return process.exit(0)
  }

  // Print the lint report results to console
  await exports.printReport(lintReport, options)

  // Only set exit code 1 if there were errors (warnings do not count)
  process.exit(lintReport.errorCount > 0 ? 1 : 0)
}

export async function lintStdIn (linter: TSStandard, options: Pick<DefaultOptions, 'fix'>): Promise<LintReport> {
  // Get text from stdin
  const text = await getStdin()

  // Lint the text
  let lintReport: LintReport
  try {
    lintReport = await linter.lintText(text)
  } catch (e) {
    const err = e as Error
    console.error(`${CMD}: Unexpected linter output:\n`)
    console.error(`${err.message}: ${err.stack as string}`)
    console.error(
      `\nIf you think this is a bug in \`${CMD}\`, open an issue: ` +
      `${require('../package.json').bugs as string}`
    )
    return process.exit(1)
  }

  // If we performed fixes then maybe return the fixed text
  if (options.fix) {
    if (lintReport.results[0].output !== undefined) {
      // Code contained fixable errors, so print the fixed code
      process.stdout.write(lintReport.results[0].output)
    } else {
      // Code did not contain fixable errors, so print original code
      process.stdout.write(text)
    }
  }

  return lintReport
}

export async function lintFiles (linter: TSStandard, options: Pick<DefaultOptions, 'files'>): Promise<LintReport> {
  // Lint the text
  let lintReport: LintReport
  try {
    lintReport = await linter.lintFiles(options.files)
  } catch (e) {
    const err = e as Error
    console.error(`${CMD}: Unexpected linter output:\n`)
    console.error(`${err.message}: ${err.stack as string}`)
    console.error(
      `\nIf you think this is a bug in \`${CMD}\`, open an issue: ` +
      `${require('../package.json').bugs as string}`
    )
    return process.exit(1)
  }

  return lintReport
}

export async function printReport (lintReport: LintReport, options: Pick<DefaultOptions, 'report' | 'fix' | 'useStdIn'>): Promise<void> {
  // Print tag line to stay consistent with standard output
  console.error(`${CMD}: ${TAGLINE} (${require('../package.json').homepage as string})`)

  // Check for any fixable rules
  const isFixable: boolean = lintReport.results.some((res: any) => {
    return res.messages.some((msg: any) => {
      return msg.fix !== undefined
    })
  })

  // If there were fixable rules, then that means that `--fix` was not provided
  if (isFixable && !options.fix) {
    console.error(
      `${CMD}: Run \`${CMD} --fix\` to automatically fix some problems.`
    )
  }

  // Check to see if a custom reporter was given, if so use that.
  let reporter: (reportResults: LintResult[]) => string
  if (options.report === 'standard') {
    // Use standard reporter
    const { standardReporter } = await import('./standard-reporter')
    reporter = standardReporter(options.useStdIn && options.fix)
  } else if (ESLINT_BUILTIN_REPORTERS.includes(options.report)) {
    // Use built-in eslint reporter
    reporter = require(`eslint/lib/cli-engine/formatters/${options.report}`)
  } else {
    // Use a custom reporter
    reporter = require(options.report)
    if (reporter == null) {
      throw new Error('Error: Unable to import custom formatter.')
    }
  }

  // Print the lint results to console using the requested formatter
  const outputReport = reporter(lintReport.results)
  // When fixing code from stdin (`standard --stdin --fix`), the transformed
  // code is printed to stdout, so print lint errors to stderr in this case.
  if (options.useStdIn && options.fix) {
    console.error(outputReport)
  } else {
    console.log(outputReport)
  }
}
