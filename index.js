import { StandardEngine } from 'standard-engine'

import options from './options.js'
import { CURRENT_WORKING_DIRECTORY } from './constants.js'
import { _getTSConfigPath } from './resolve-tsconfig.js'

const engineOptions = { ...options }

engineOptions.eslintConfig.overrideConfig.parserOptions.project = _getTSConfigPath(
  CURRENT_WORKING_DIRECTORY
)

export default new StandardEngine(engineOptions)
