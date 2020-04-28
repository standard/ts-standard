import * as eslint from 'eslint'
import { join, resolve } from 'path'
import { linter as Linter, LintReport } from 'standard-engine'
import {
  getDefaultOptions, getPackageOptions,
  mergeOptions, CMD, TAGLINE
} from './options'

export interface Options {
  project?: string
  fix?: boolean
  envs?: string[]
  ignore?: string[]
  noDefaultIgnore?: boolean
  globals?: string[]
  plugins?: string[]
  cwd?: string
  // Really advanced options
  parser?: string
  eslint?: string | typeof eslint
}

export interface TSStandardLintOptions {
  fix?: boolean
  globals?: string[]
  plugins?: string[]
  envs?: string[]
  parser?: string
  cwd?: string
  filename?: string
}

export type LintCallBack = (error?: Error, results?: LintReport) => void

export class TSStandard {
  private readonly standardEngine: Linter
  private readonly defaultPerLintOptions: TSStandardLintOptions

  constructor (options: Options = {}) {
    // Get the default/cli options
    const defaultOptions = getDefaultOptions(options.cwd)
    const packageOptions = getPackageOptions(options.cwd)
    options = mergeOptions(defaultOptions, packageOptions, options)

    // Linting requires a project file
    if (options.project == null) {
      throw new Error('Unable to locate the project file. A project file (tsconfig.json or ' +
        'tsconfig.eslint.json) is reqired in order to use ts-standard.')
    }

    // Handle the case where eslint lib could be a string, library, or undefined (use default lib)
    let eslintLib: typeof eslint
    if (typeof options.eslint === 'string') {
      eslintLib = require(options.eslint)
    } else if (options.eslint != null) {
      eslintLib = options.eslint
    } else {
      eslintLib = eslint
    }

    // Compile all the various options needed to construct standard-engine linter
    const standardEngineOptions = {
      cmd: CMD,
      version: require('../package.json').version,
      homepage: require('../package.json').homepage,
      bugs: require('../package.json').bugs.url,
      tagline: TAGLINE,
      eslint: eslintLib,
      eslintConfig: {
        configFile: resolve(join(__dirname, '../eslintrc.json')),
        parserOptions: {
          project: options.project,
          tsconfigRootDir: options.cwd
        }
      }
    }
    this.standardEngine = new Linter(standardEngineOptions)

    // Set the standard-engine linter options
    this.defaultPerLintOptions = {
      fix: options.fix,
      globals: options.globals,
      plugins: options.plugins,
      envs: options.envs,
      parser: options.parser
    }
  }

  async lintText (text: string, options?: TSStandardLintOptions): Promise<LintReport> {
    options = options ?? {}
    options = {
      ...this.defaultPerLintOptions,
      ...options
    }
    return await new Promise((resolve, reject) => {
      this.standardEngine.lintText(text, options, (err, val) => {
        if (err != null) {
          return reject(err)
        }
        return resolve(val)
      })
    })
  }

  async lintFiles (files: string[], options: TSStandardLintOptions = {}): Promise<LintReport> {
    options = {
      ...this.defaultPerLintOptions,
      ...options
    }
    return await new Promise((resolve, reject) => {
      this.standardEngine.lintFiles(files, options, (err, val) => {
        if (err != null) {
          return reject(err)
        }
        return resolve(val)
      })
    })
  }
}
