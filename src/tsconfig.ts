import * as path from 'path'
import { statSync } from 'fs'
import pkgConf from 'pkg-conf'

interface TSStandardConfig {
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

  async getConfigFilePath (): Promise<string | undefined> {
    const settingsPath = await this._getTSConfigPathFromSettings()
    if (settingsPath !== undefined) {
      return settingsPath
    }
    return this._getTSConfigFromDefaultLocations()
  }

  async _getTSConfigPathFromSettings (): Promise<string | undefined> {
    const res: TSStandardConfig = await pkgConf('ts-standard', { cwd: this.cwd }) as any
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
