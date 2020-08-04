import * as pkgConf from 'pkg-conf'
import { _resolveTSConfigPath, getPackageOptions } from './package-options'
import * as defaultLib from './default-options'

describe('package-options', () => {
  describe('_resolveTSConfigPath', (): void => {
    const packageJsonPath = '/path/from/package.json'

    it('should return a valid path from package.json first', (): void => {
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(true)
      const validPath = _resolveTSConfigPath(process.cwd(), packageJsonPath)
      expect(validPath).toMatch(packageJsonPath)
    })

    it('should use provided cwd when resolving the path', (): void => {
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(true)
      const validPath = _resolveTSConfigPath('/custom/cwd', packageJsonPath)
      expect(validPath).toMatch(/\/custom\/cwd/gi)
      expect(validPath).toMatch(packageJsonPath)
    })

    it('should return undefined if no valid paths found', (): void => {
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(false)
      const validPath = _resolveTSConfigPath(process.cwd(), packageJsonPath)
      expect(validPath).toBeUndefined()
    })

    it('should return undefined if no valid project path given', (): void => {
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(true)
      const validPath = _resolveTSConfigPath(process.cwd())
      expect(validPath).toBeUndefined()
    })
  })

  describe('getPackageOptions', (): void => {
    it('should return a valid project path if one is found found', (): void => {
      const projectRelativeLocation = './tsconfig.eslint.json'
      jest.spyOn(pkgConf, 'sync').mockReturnValueOnce({
        project: projectRelativeLocation
      })
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(true)
      const options = getPackageOptions()
      expect(options.project).toMatch(/tsconfig.eslint.json/gi)
    })

    it('should return all settings provided by package.json', (): void => {
      const packageData = {
        ignore: ['ignore'],
        noDefaultIgnore: true,
        globals: ['$', 'jquery'],
        plugins: 'babel',
        envs: ['lightside', 'darkside'],
        parser: 'obi-wan',
        cwd: '/the/path/to/the/darkside',
        eslint: 'custom-linter!',
        files: ['./src/**/*.ts', './*.ts'],
        project: './tsconfig.json',
        fix: true,
        report: 'stylish'
      }
      jest.spyOn(pkgConf, 'sync').mockReturnValueOnce(packageData)
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(true)
      const options = getPackageOptions()
      expect(options.files).toEqual(packageData.files)
      expect(options.project).toMatch(packageData.project.slice(1))
      expect(options.project).toMatch(packageData.cwd)
      expect(options.fix).toEqual(packageData.fix)
      expect(options.report).toEqual(packageData.report)
      expect(options.noDefaultIgnore).toEqual(packageData.noDefaultIgnore)
      expect(options.globals).toEqual(packageData.globals)
      expect(options.plugins).toEqual(packageData.plugins)
      expect(options.envs).toEqual(packageData.envs)
      expect(options.parser).toEqual(packageData.parser)
      expect(options.eslint).toEqual(packageData.eslint)
    })

    it('should use cwd function arg over package.json setting', (): void => {
      const packageData = {
        files: ['./src/**/*.ts', './*.ts'],
        project: './tsconfig.json',
        cwd: '/the/path/to/the/darkside'
      }
      jest.spyOn(pkgConf, 'sync').mockReturnValueOnce(packageData)
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(true)
      const options = getPackageOptions('/custom/cwd')
      expect(options.project).toMatch(packageData.project.slice(1))
      expect(options.project).toMatch(/\/custom\/cwd/)
    })

    it('should return undefined for any settings not provided by package.json', (): void => {
      const packageData = {
        files: ['./src/**/*.ts', './*.ts'],
        project: './tsconfig.json',
        fix: true,
        report: 'stylish'
      }
      jest.spyOn(pkgConf, 'sync').mockReturnValueOnce(packageData)
      jest.spyOn(defaultLib, '_isValidPath').mockReturnValueOnce(true)
      const options = getPackageOptions()
      expect(options.files).toEqual(packageData.files)
      expect(options.project).toMatch(packageData.project.slice(1))
      expect(options.project).toMatch(process.cwd())
      expect(options.fix).toEqual(packageData.fix)
      expect(options.report).toEqual(packageData.report)
      expect(options.noDefaultIgnore).toBeUndefined()
      expect(options.globals).toBeUndefined()
      expect(options.plugins).toBeUndefined()
      expect(options.envs).toBeUndefined()
      expect(options.parser).toBeUndefined()
      expect(options.eslint).toBeUndefined()
    })
  })
})
