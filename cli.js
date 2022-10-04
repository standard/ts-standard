#!/usr/bin/env node

import { cli } from 'standard-engine'
import minimist from 'minimist'

import options from './options.js'
import { CURRENT_WORKING_DIRECTORY } from './constants.js'
import { _getTSConfigPath } from './resolve-tsconfig.js'

const tsStandardCli = () => {
  const cliOptions = { ...options }

  const argv = minimist(process.argv.slice(2), {
    alias: {
      project: 'p',
      help: 'h'
    },
    boolean: ['help'],
    string: ['project']
  })

  if (argv.help) {
    console.log(
      '%s - %s (%s)',
      cliOptions.cmd,
      cliOptions.tagline,
      cliOptions.homepage
    )
    console.log(`
Usage:
  ${cliOptions.cmd} <flags> [FILES...]

  If FILES is omitted, all JavaScript/TypeScript source files (*.js, *.jsx, *.mjs, *.cjs, *.ts, *.tsx)
  in the current working directory are checked, recursively.

  Certain paths (node_modules/, coverage/, vendor/, *.min.js, and
  files/folders that begin with '.' like .git/) are automatically ignored.

  Paths in a project's root .gitignore file are also automatically ignored.

Flags:
      --fix       Automatically fix problems
  -p, --project   Specify ts-config location (default: ./tsconfig.eslint.json or ./tsconfig.json)
      --version   Show current version
  -h, --help      Show usage information

Flags (advanced):
      --stdin     Read file text from stdin
      --ext       Specify JavaScript/TypeScript file extensions
      --global    Declare global variable
      --plugin    Use custom eslint plugin
      --env       Use custom eslint environment
      --parser    Use custom ts/js parser (default: @typescript-eslint/parser)
    `)
    process.exitCode = 0
    return
  }

  if (argv.version) {
    console.log(cliOptions.version)
    process.exitCode = 0
    return
  }

  cliOptions.eslintConfig.overrideConfig.parserOptions.project = _getTSConfigPath(
    CURRENT_WORKING_DIRECTORY,
    argv.project
  )

  cli(cliOptions)
}

tsStandardCli()
