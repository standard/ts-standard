import { join } from 'path'
import * as eslint from 'eslint'
import { TSConfig } from './tsconfig'

export interface Options {
  cmd: string
  version: string
  homepage: string
  bugs: string
  tagline: string
  eslint: any
  eslintConfig: eslint.CLIEngine.Options
}

export async function getOptions (): Promise<Options> {
  const tsConfig = new TSConfig()
  return {
    // cmd, homepage, bugs all pulled from package.json
    cmd: 'ts-standard',
    version: require('../package.json').version,
    homepage: require('../package.json').homepage,
    bugs: require('../package.json').bugs.url,
    tagline: 'Standard for Typescript!',
    eslint,
    eslintConfig: {
      configFile: join(__dirname, '../eslintrc.json'),
      parserOptions: {
        project: await tsConfig.getConfigFilePath()
      }
    }
  }
}
