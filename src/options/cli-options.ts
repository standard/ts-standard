import * as minimist from 'minimist'
import { CMD, TAGLINE, HOMEPAGE, VERSION } from '../constants'

interface ParsedArgs extends minimist.ParsedArgs {
  fix: boolean
  help: boolean
  stdin: boolean
  version: boolean
  ['stdin-filename']?: string
  globals?: string | string[]
  plugins?: string | string[]
  envs?: string | string[]
  parser?: string
  project?: string
  report?: string
}

export interface CLIOptions {
  fix: boolean
  useStdIn: boolean
  stdInFilename?: string
  files?: string[]
  project?: string
  globals?: string[]
  plugins?: string[]
  envs?: string[]
  parser?: string
  report?: string
}

export function getCLIOptions (): CLIOptions {
  // Parse the command line arguments
  const argv = minimist(process.argv.slice(2), {
    alias: {
      globals: 'global',
      plugins: 'plugin',
      envs: 'env',
      help: 'h',
      project: 'p'
    },
    boolean: ['fix', 'help', 'stdin', 'version'],
    string: [
      'globals',
      'plugins',
      'parser',
      'envs',
      'project',
      'report',
      'stdin-filename'
    ]
  }) as ParsedArgs

  // Unix convention: Command line argument `-` is a shorthand for `--stdin`
  if (argv._[0] === '-') {
    argv.stdin = true
    argv._.shift()
  }

  // Print the help section if so requested
  if (argv.help) {
    console.log('%s - %s (%s)', CMD, TAGLINE, HOMEPAGE)
    console.log(`
Usage:
    ${CMD} <flags> [FILES...]
    If FILES is omitted, all JavaScript/Typescript source files (*.js, *.jsx, *.mjs, *.cjs, *.ts, *.tsx)
    in the current working directory are checked, recursively.
    Certain paths (node_modules/, coverage/, vendor/, *.min.js, bundle.js, and
    files/folders that begin with '.' like .git/) are automatically ignored.
    Paths in a project's root .gitignore file are also automatically ignored.
Flags:
        --fix              Automatically fix problems
    -p, --project          Specify ts-config location (default: ./tsconfig.eslint.json or ./tsconfig.json)
        --version          Show current version
    -h, --help             Show usage information
Flags (advanced):
        --stdin            Read file text from stdin (requires using --stdin-filename)
        --stdin-filename   The filename and path of the contents read by stdin
        --globals          Declare global variable
        --plugins          Use custom eslint plugin
        --envs             Use custom eslint environment
        --parser           Use custom ts/js parser (default: @typescript-eslint/parser)
        --report           Use a built-in eslint reporter or custom eslint reporter (default: standard)
    `)
    return process.exit(0)
  }

  // Print out the version number if requested
  if (argv.version) {
    console.log(VERSION)
    return process.exit(0)
  }

  // Get the files/globs to lint
  const files = argv._.length !== 0 ? argv._ : undefined

  const options = {
    fix: argv.fix,
    useStdIn: argv.stdin,
    stdInFilename: argv['stdin-filename'],
    files,
    project: argv.project,
    globals: exports._convertToArray(argv.globals),
    plugins: exports._convertToArray(argv.plugins),
    envs: exports._convertToArray(argv.envs),
    parser: argv.parser,
    report: argv.report
  }

  if (options.useStdIn && options.stdInFilename == null) {
    console.error(
      'Must provide the `--stdin-filename` flag when using the `--stdin` flag.'
    )
    process.exit(1)
  }

  return options
}

export function _convertToArray<T> (val?: T | T[]): T[] | undefined {
  if (val != null && !Array.isArray(val)) {
    return [val]
  }
  if (Array.isArray(val)) {
    return val
  }
}
