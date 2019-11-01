import * as path from 'path'
import { statSync } from 'fs'
import * as pkgConf from 'pkg-conf'

interface TSStandardConfig extends pkgConf.Config {
  project?: string
  ignore?: string[]
  noDefaultIgnore?: boolean
  global?: string[]
  globals?: string[]
  plugin?: string[]
  plugins?: string[]
  env?: string[]
  envs?: string[]
  parser: string
}

export const DEFAULT_TSCONFIG_LOCATIONS = [
  'tsconfig.eslint.json',
  'tsconfig.json'
]

export class TSConfig {
  private readonly cwd: string;
  constructor () {
    this.cwd = process.cwd()
  }

  getConfigFilePath (): string | undefined {
    const settingsPath = this._getTSConfigPathFromSettings()
    if (settingsPath !== undefined) {
      return settingsPath
    }
    return this._getTSConfigFromDefaultLocations()
  }

  _getTSConfigPathFromSettings (): string | undefined {
    const res: TSStandardConfig = pkgConf.sync('ts-standard', { cwd: this.cwd })
    if (res.project !== undefined) {
      const settingsPath = path.join(this.cwd, res.project)
      if (this._isValidPath(settingsPath)) {
        return settingsPath
      }
    }
  }

  _getTSConfigFromDefaultLocations (): string | undefined {
    for (const tsFile of DEFAULT_TSCONFIG_LOCATIONS) {
      const absPath = path.join(this.cwd, tsFile)
      if (this._isValidPath(absPath)) {
        return absPath
      }
    }
  }

  _isValidPath (pathToValidate: string): boolean {
    try {
      statSync(pathToValidate)
    } catch (e) {
      return false
    }
    return true
  }
}
