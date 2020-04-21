import { join } from 'path'
import * as eslint from 'eslint'
import { TSStandardSettings, getTSStandardSettings } from './ts-standard-settings'

export interface Options {
  cmd: string
  version: string
  homepage: string
  bugs: string
  tagline: string
  eslint: any
  eslintConfig: eslint.CLIEngine.Options
  formatter: TSStandardSettings['formatter']
  fix: TSStandardSettings['fix']
}

export async function getOptions (): Promise<Options> {
  const settings = await getTSStandardSettings()
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
        project: settings.project
      }
    },
    formatter: settings.formatter,
    fix: settings.fix
  }
}
