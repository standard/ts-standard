import * as path from 'path'
import { statSync } from 'fs'
import * as pkgConf from 'pkg-conf'

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

const DEFAULT_TSCONFIG_LOCATIONS = [
  'tsconfig.eslint.json',
  'tsconfig.json'
]

function getTSConfigFromDefaultLocations (): string | undefined {
  const cwd = process.cwd()
  for (const tsFile of DEFAULT_TSCONFIG_LOCATIONS) {
    const absPath = path.join(cwd, tsFile)
    if (isValidPath(absPath)) {
      return absPath
    }
  }
}

function isValidPath (pathToValidate: string): boolean {
  try {
    statSync(pathToValidate)
  } catch (e) {
    return false
  }
  return true
}

async function getTSConfigPathFromSettings (): Promise<string | undefined> {
  const cwd = process.cwd()
  const res: TSStandardConfig = await pkgConf('ts-standard', { cwd }) as any
  if (res.project !== undefined) {
    const settingsPath = path.join(cwd, res.project)
    if (isValidPath(settingsPath)) {
      return settingsPath
    }
  }
}

export async function getTSConfigFile (): Promise<string | undefined> {
  const settingsPath = await getTSConfigPathFromSettings()
  if (settingsPath !== undefined) {
    return settingsPath
  }
  return getTSConfigFromDefaultLocations()
}
