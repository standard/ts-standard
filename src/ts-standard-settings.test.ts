import { join } from 'path'
import * as pkgConf from 'pkg-conf'
import { statSync } from 'fs'
import {
  _isValidPath, _getTSConfigFromDefaultLocations,
  _resolveTSConfigPath, getTSStandardSettings
} from '../src/ts-standard-settings'

jest.mock('pkg-conf')
jest.mock('fs')

const mockStatSync = statSync as jest.MockedFunction<typeof statSync>
const mockPkgConfig = pkgConf as jest.MockedFunction<typeof pkgConf>

describe('tsconfig', () => {
  describe('_isValidPath', () => {
    beforeEach(() => {
      mockStatSync.mockImplementation((...args) => jest.requireActual('fs').statSync(...args))
    })

    it('should return true for a valid path', () => {
      const validPath = join(__dirname, '/options.test.ts')
      const isValid = _isValidPath(validPath)
      expect(isValid).toEqual(true)
    })

    it('should return false for an invalid path', () => {
      const invalidPath = join(__dirname, '/non-existent-file.ts')
      const isValid = _isValidPath(invalidPath)
      expect(isValid).toEqual(false)
    })
  })

  describe('_getTSConfigFromDefaultLocations', (): void => {
    it('should return a valid path if one is found', (): void => {
      const validPath = _getTSConfigFromDefaultLocations()
      expect(validPath).toMatch(/tsconfig\.eslint\.json/gi)
    })

    it('should return undefined if no valid path found', (): void => {
      mockStatSync.mockImplementation(() => { throw new Error('Error') })
      const validPath = _getTSConfigFromDefaultLocations()
      expect(validPath).toBeUndefined()
    })
  })

  describe('_resolveTSConfigPath', (): void => {
    const packageJsonPath = '/path/from/package.json'
    const defaultLocationPath = '/tsconfig.eslint.json'

    it('should return a valid path from package.json first', (): void => {
      mockStatSync.mockReturnValue(true as any)
      const validPath = _resolveTSConfigPath(packageJsonPath)
      expect(validPath).toMatch(packageJsonPath)
    })

    it('should return a valid path from default location if no package.json setting found', (): void => {
      mockStatSync.mockImplementationOnce(() => { throw new Error('Error') })
      const validPath = _resolveTSConfigPath(packageJsonPath)
      expect(validPath).toMatch(defaultLocationPath)
    })

    it('should return undefined if no valid paths found', (): void => {
      mockStatSync.mockImplementation(() => { throw new Error('Error') })
      const validPath = _resolveTSConfigPath(packageJsonPath)
      expect(validPath).toBeUndefined()
    })
  })

  describe('getTSStandardSettings', (): void => {
    it('should return a valid project path if one is found found', async (): Promise<void> => {
      const projectRelativeLocation = './tsconfig.eslint.json'
      mockPkgConfig.mockResolvedValue({
        project: projectRelativeLocation,
        fix: true,
        formatter: 'test'
      })
      mockStatSync.mockImplementation((...args) => jest.requireActual('fs').statSync(...args))
      const settings = await getTSStandardSettings()
      expect(settings.project).toMatch(/tsconfig.eslint.json/gi)
      expect(settings.fix).toEqual(true)
      expect(settings.formatter).toEqual('test')
    })

    it('should return undefined if no valid path found', async (): Promise<void> => {
      mockPkgConfig.mockResolvedValue({ project: './non-existent-file.ts' })
      mockStatSync.mockImplementation(() => { throw new Error('Error') })
      const settings = await getTSStandardSettings()
      expect(settings.project).toBeUndefined()
    })

    it('should return undefined if project settings not provided', async (): Promise<void> => {
      mockPkgConfig.mockResolvedValue({})
      const settings = await getTSStandardSettings()
      expect(settings.project).toBeUndefined()
    })
  })
})
