import { isAbsolute, join } from 'node:path'
import { statSync } from 'node:fs'

import { packageConfigSync } from 'pkg-conf'

import { DEFAULT_TSCONFIG_LOCATIONS } from './constants.js'

/**
 *
 * @param {string} pathToValidate
 * @returns {boolean}
 */
const _isValidPath = (pathToValidate) => {
  try {
    statSync(pathToValidate)
  } catch {
    return false
  }
  return true
}

/**
 *
 * @param {string} cwd
 * @param {string} settingsProjectPath
 * @returns {string | undefined}
 */
export const _resolveTSConfigPath = (cwd, settingsProjectPath) => {
  let settingsPath = settingsProjectPath
  if (!isAbsolute(settingsPath)) {
    settingsPath = join(cwd, settingsProjectPath)
  }
  if (_isValidPath(settingsPath)) {
    return settingsPath
  }
  return undefined
}

/**
 *
 * @param {string} cwd
 * @returns {string | undefined}
 */
export const _getTSConfigFromDefaultLocations = (cwd) => {
  for (const tsFile of DEFAULT_TSCONFIG_LOCATIONS) {
    const absolutePath = _resolveTSConfigPath(cwd, tsFile)
    if (absolutePath !== undefined) {
      return absolutePath
    }
  }
  return undefined
}

/**
 *
 * @param {string} cwd
 * @param {string | undefined} cliProjectOption
 * @returns {string}
 */
export const _getTSConfigPath = (cwd, cliProjectOption) => {
  /** @type {string | undefined} */
  let tsConfigPath = _getTSConfigFromDefaultLocations(cwd)

  if (cliProjectOption !== undefined) {
    tsConfigPath = _resolveTSConfigPath(cwd, cliProjectOption)
  } else {
    const settings = packageConfigSync('ts-standard', { cwd })
    if (settings.project != null) {
      tsConfigPath = _resolveTSConfigPath(cwd, settings.project)
    }
  }

  if (tsConfigPath === undefined) {
    console.error(
      'Unable to locate the project file. A project file (tsconfig.json or ' +
        'tsconfig.eslint.json) is required in order to use ts-standard.'
    )
    return process.exit(1)
  }

  return tsConfigPath
}
