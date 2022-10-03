import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import eslint from 'eslint'

import { DEFAULT_EXTENSIONS } from './constants.js'

// eslintConfig.overrideConfigFile have problem reading URLs and file:///
const overrideConfigFile = fileURLToPath(new URL('./eslintrc.json', import.meta.url))
const pkgURL = new URL('./package.json', import.meta.url)
const pkgJSON = readFileSync(pkgURL, { encoding: 'utf-8' })
const pkg = JSON.parse(pkgJSON)

export default {
  bugs: pkg.bugs.url,
  cmd: 'ts-standard',
  eslint,
  eslintConfig: {
    overrideConfigFile,
    extensions: DEFAULT_EXTENSIONS,
    overrideConfig: {
      parserOptions: {
        project: undefined
      }
    }
  },
  homepage: pkg.homepage,
  tagline: 'Standard for TypeScript!',
  version: pkg.version
}
