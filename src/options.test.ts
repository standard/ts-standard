import { getTSStandardSettings } from '../src/ts-standard-settings'
import * as optionsLib from '../src/options'

jest.mock('../src/ts-standard-settings')

const mockGetTSStandardSettings = getTSStandardSettings as jest.MockedFunction<typeof getTSStandardSettings>

describe('options', () => {
  describe('getOptions', (): void => {
    it('should return the correct options', async (): Promise<void> => {
      const projectPath = 'some/project.path'
      mockGetTSStandardSettings.mockResolvedValue({
        project: projectPath,
        fix: true,
        formatter: 'test'
      })
      const options = await optionsLib.getOptions()
      expect(options.cmd).toEqual('ts-standard')
      expect(options.version).toEqual(require('../package.json').version)
      expect(options.homepage).toEqual(require('../package.json').homepage)
      expect(options.bugs).toEqual(require('../package.json').bugs.url)
      expect(options.tagline).toEqual('Standard for Typescript!')
      expect(options.eslint).toBeDefined()
      expect(options.eslintConfig.configFile).toBeDefined()
      expect(options.eslintConfig.configFile).toMatch(/eslintrc\.json/gi)
      expect(options.eslintConfig.parserOptions).toBeDefined()
      expect(options.eslintConfig.parserOptions?.project).toEqual(projectPath)
      expect(options.fix).toEqual(true)
      expect(options.formatter).toEqual('test')
    })
  })
})
