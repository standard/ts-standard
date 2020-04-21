import * as path from 'path'
import { statSync } from 'fs'
import * as pkgConf from 'pkg-conf'

type EslintBuiltInFormatters = 'stylish' | 'checkstyle' | 'codeframe' | 'compact' |
'html' | 'jslint-xml' | 'json' | 'junit' | 'table' | 'tap' | 'unix' | 'visualstudio'

// Note most of these options are passed to `standard-engine` automagically because
// `standard-engine` also uses `pkg-conf` under the hood as well
export interface TSStandardSettings extends pkgConf.Config {
  // Automagically imported by `standard-engine`
  ignore?: string[]
  noDefaultIgnore?: boolean
  global?: string[]
  globals?: string[]
  plugin?: string[]
  plugins?: string[]
  env?: string[]
  envs?: string[]
  parser?: string
  // Custom options manually brough
  project?: string
  formatter: string | EslintBuiltInFormatters
  fix?: boolean
}

export const DEFAULT_TSCONFIG_LOCATIONS = [
  'tsconfig.eslint.json',
  'tsconfig.json'
]

export async function getTSStandardSettings (): Promise<TSStandardSettings> {
  const settings: TSStandardSettings = await pkgConf('ts-standard', { cwd: process.cwd() })
  // Resolve the path to the tsconfig file
  settings.project = exports._resolveTSConfigPath(settings.project)

  // set defaults
  settings.formatter = settings.formatter ?? 'stylish'
  settings.fix = settings.fix ?? false

  return settings
}

export function _resolveTSConfigPath (settingsProjectPath?: string): string | undefined {
  if (settingsProjectPath !== undefined) {
    const settingsPath = path.join(process.cwd(), settingsProjectPath)
    if (exports._isValidPath(settingsPath) as boolean) {
      return settingsPath
    }
  }
  return exports._getTSConfigFromDefaultLocations()
}

export function _getTSConfigFromDefaultLocations (): string | undefined {
  for (const tsFile of DEFAULT_TSCONFIG_LOCATIONS) {
    const absPath = path.join(process.cwd(), tsFile)
    if (exports._isValidPath(absPath) as boolean) {
      return absPath
    }
  }
}

export function _isValidPath (pathToValidate: string): boolean {
  try {
    statSync(pathToValidate)
  } catch (e) {
    return false
  }
  return true
}
