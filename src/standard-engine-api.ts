import { TSStandard, TSStandardLintOptions, LintCallBack } from './ts-standard'

// All exports are to satisfy the `standard-engine` export interface used by
// the vscode standard extension and other editor extensions

// Yes this is a singleton and I don't really like them either
let singletonInstance: TSStandard
let cachedCWD: string | undefined

export interface ParseOptions {
  cwd?: string
  filename?: string
}

// Typically called before any lint calls, allows early reading and manipulation of options provided
// to the later lint call
export function parseOpts (options: ParseOptions): ParseOptions {
  // If the singleton does not exist or a new working directory is given then create a new instance
  if (singletonInstance == null || cachedCWD !== options.cwd) {
    cachedCWD = options.cwd
    singletonInstance = new TSStandard({
      cwd: options.cwd
    })
  }
  return options
}

// Export some function overload signatures to help with intellisense
export function lintText(text: string, options: LintCallBack): void;
export function lintText(
  text: string,
  options: TSStandardLintOptions & ParseOptions,
  callback: LintCallBack
): void;
export function lintText (
  text: string,
  options: TSStandardLintOptions & ParseOptions | LintCallBack,
  callback?: LintCallBack
): void {
  let cb = callback as LintCallBack
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  if (singletonInstance == null) {
    exports.parseOpts(options)
  }
  singletonInstance.lintText(text, options)
    .then(res => cb(undefined, res))
    .catch(cb)
}

// Export some function overload signatures to help with intellisense
export function lintFiles(files: string[], options: LintCallBack): void
export function lintFiles(
  files: string[],
  options: TSStandardLintOptions & ParseOptions,
  callback: LintCallBack
): void
export function lintFiles (
  files: string[],
  options: TSStandardLintOptions & ParseOptions | LintCallBack,
  callback?: LintCallBack
): void {
  let cb = callback as LintCallBack
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  if (singletonInstance == null) {
    exports.parseOpts(options)
  }
  singletonInstance.lintFiles(files, options)
    .then(res => cb(undefined, res))
    .catch(cb)
}
