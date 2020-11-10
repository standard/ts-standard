import { join, resolve } from 'path'
import { statSync } from 'fs'
import {
  _isValidPath,
  _getTSConfigFromDefaultLocations,
  getDefaultOptions
} from './default-options'

jest.mock('pkg-conf')
jest.mock('fs')

const mockStatSync = statSync as jest.MockedFunction<typeof statSync>

describe('default-options', () => {
  describe('_isValidPath', () => {
    beforeEach(() => {
      mockStatSync.mockImplementation((...args) =>
        jest.requireActual('fs').statSync(...args)
      )
    })

    it('should return true for a valid path', () => {
      const validPath = resolve(join(__dirname, '/default-options.test.ts'))
      const isValid = _isValidPath(validPath)
      expect(isValid).toEqual(true)
    })

    it('should return false for an invalid path', () => {
      const invalidPath = join(resolve(__dirname, '/non-existent-file.ts'))
      const isValid = _isValidPath(invalidPath)
      expect(isValid).toEqual(false)
    })
  })

  describe('_getTSConfigFromDefaultLocations', (): void => {
    it('should return a valid path if one is found', (): void => {
      const validPath = _getTSConfigFromDefaultLocations(process.cwd())
      expect(validPath).toMatch(/tsconfig\.eslint\.json/gi)
    })

    it('should use custom working directory provided', (): void => {
      mockStatSync.mockReturnValueOnce(true as any)
      const validPath = _getTSConfigFromDefaultLocations('/custom/path')
      expect(validPath).toMatch(/tsconfig\.eslint\.json/gi)
      expect(validPath).toMatch(/\/custom\/path/gi)
      expect(mockStatSync.mock.calls[0][0]).toMatch(/\/custom\/path/gi)
    })

    it('should return undefined if no valid path found', (): void => {
      mockStatSync.mockImplementation(() => {
        throw new Error('Error')
      })
      const validPath = _getTSConfigFromDefaultLocations(process.cwd())
      expect(validPath).toBeUndefined()
    })
  })

  describe('getDefaultOptions', (): void => {
    it('should return all default options', async (): Promise<void> => {
      mockStatSync.mockImplementation((...args) =>
        jest.requireActual('fs').statSync(...args)
      )
      const options = await getDefaultOptions()
      expect(options.files).toHaveLength(0)
      expect(options.project).toMatch(/tsconfig.eslint.json/gi)
      expect(options.fix).toEqual(false)
      expect(options.report).toEqual('standard')
      expect(options.useStdIn).toEqual(false)
      expect(options.noDefaultIgnore).toEqual(false)
      expect(options.eslint).toBeUndefined()
      expect(options.cwd).toEqual(process.cwd())
      expect(options.ignore).toBeUndefined()
      expect(options.envs).toBeUndefined()
      expect(options.globals).toBeUndefined()
      expect(options.plugins).toBeUndefined()
      expect(options.parser).toBeUndefined()
      expect(options.stdInFilename).toBeUndefined()
      expect(options.extensions).toHaveLength(6)
    })

    it('should use provided cwd', async (): Promise<void> => {
      mockStatSync.mockReturnValueOnce(true as any)
      const options = await getDefaultOptions('/custom/path')
      expect(options.files).toHaveLength(0)
      expect(options.project).toMatch(/\/custom\/path/gi)
      expect(options.fix).toEqual(false)
      expect(options.report).toEqual('standard')
      expect(options.useStdIn).toEqual(false)
      expect(options.noDefaultIgnore).toEqual(false)
      expect(options.eslint).toBeUndefined()
      expect(options.cwd).toEqual('/custom/path')
      expect(options.ignore).toBeUndefined()
      expect(options.envs).toBeUndefined()
      expect(options.globals).toBeUndefined()
      expect(options.plugins).toBeUndefined()
      expect(options.parser).toBeUndefined()
      expect(options.stdInFilename).toBeUndefined()
      expect(options.extensions).toHaveLength(6)
    })

    it('should return undefined if project options not provided', async (): Promise<
    void
    > => {
      mockStatSync.mockImplementation(() => {
        throw new Error('Error')
      })
      const options = await getDefaultOptions()
      expect(options.project).toBeUndefined()
    })
  })
})
