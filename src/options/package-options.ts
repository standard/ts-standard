import { join } from 'path'
import { Config, sync } from 'pkg-conf'
import { _isValidPath } from './default-options'

// Note most of these options are passed to `standard-engine` automagically because
// `standard-engine` also uses `pkg-conf` under the hood as well
interface PackageConfigOptions extends Config {
  ignore?: string[]
  noDefaultIgnore?: boolean
  globals?: string[]
  plugins?: string[]
  envs?: string[]
  parser?: string
  cwd?: string
  eslint?: string
  files?: string[]
  project?: string
  fix?: boolean
  report?: string
}

interface PackageOptions {
  files?: string[]
  project?: string
  fix?: boolean
  report?: string
  ignore?: string[]
  noDefaultIgnore?: boolean
  globals?: string[]
  plugins?: string[]
  envs?: string[]
  parser?: string
  eslint?: string
  cwd?: string
}

export function getPackageOptions (cwd?: string): PackageOptions {
  const settings: PackageConfigOptions = sync('ts-standard', { cwd })
  cwd = cwd ?? settings.cwd ?? process.cwd()
  return {
    files: settings.files,
    project: exports._resolveTSConfigPath(cwd, settings.project),
    fix: settings.fix,
    report: settings.report,
    ignore: settings.ignore,
    noDefaultIgnore: settings.noDefaultIgnore,
    globals: settings.globals,
    plugins: settings.plugins,
    envs: settings.envs,
    parser: settings.parser,
    eslint: settings.eslint,
    cwd
  }
}

export function _resolveTSConfigPath (
  cwd: string,
  settingsProjectPath?: string
): string | undefined {
  if (settingsProjectPath !== undefined) {
    const settingsPath = join(cwd, settingsProjectPath)
    if (_isValidPath(settingsPath)) {
      return settingsPath
    }
  }
}
