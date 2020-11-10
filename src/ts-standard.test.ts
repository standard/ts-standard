import * as lintLib from 'standard-engine'
import { resolve } from 'path'
import * as eslint from 'eslint'
import * as defaultOptions from './options/default-options'
import * as packageOptions from './options/package-options'
import { TSStandard, Options } from './ts-standard'
import { CMD, TAGLINE, BUGS_URL, HOMEPAGE, VERSION } from './constants'

jest.mock('standard-engine')

const customEslint = jest.fn().mockReturnThis()
jest.mock('custom-eslint', () => customEslint, { virtual: true })

describe('ts-standard', () => {
  describe('TSStandard', () => {
    describe('constructor', () => {
      it('should initialize a new standard-engine linter with the given settings', () => {
        const linterSpy = jest.spyOn(lintLib, 'linter').mockReturnThis()

        const options = {
          cwd: '/some/path',
          envs: ['node', 'browser'],
          plugins: ['babel'],
          eslint: {} as any,
          fix: true,
          globals: ['$', 'jquery'],
          ignore: ['/some/ignore/path'],
          noDefaultIgnore: true,
          parser: 'typescript',
          project: '/some/project.json'
        }
        const linter = new TSStandard(options)
        expect(linter).toBeDefined()
        expect(linterSpy).toHaveBeenCalledTimes(1)
        expect(linterSpy).toHaveBeenCalledWith({
          cmd: CMD,
          version: VERSION,
          homepage: HOMEPAGE,
          bugs: BUGS_URL,
          tagline: TAGLINE,
          eslint: options.eslint,
          eslintConfig: {
            cwd: options.cwd,
            configFile: resolve(`${__dirname}/../eslintrc.json`),
            parserOptions: {
              project: options.project,
              tsconfigRootDir: options.cwd
            }
          }
        })
      })

      it('should import a custom eslinter if `string` provided', () => {
        const linterSpy = jest.spyOn(lintLib, 'linter').mockReturnThis()

        const options = {
          eslint: 'custom-eslint'
        }
        const linter = new TSStandard(options)
        expect(linter).toBeDefined()
        expect(linterSpy).toHaveBeenCalledTimes(1)
        expect((linterSpy.mock.calls[0][0] as Options).eslint).toEqual(
          customEslint
        )
      })

      it('should use the provide eslint if given', () => {
        const linterSpy = jest.spyOn(lintLib, 'linter').mockReturnThis()

        const options = {
          eslint: {} as any
        }
        const linter = new TSStandard(options)
        expect(linter).toBeDefined()
        expect(linterSpy).toHaveBeenCalledTimes(1)
        expect((linterSpy.mock.calls[0][0] as Options).eslint).toEqual(
          options.eslint
        )
      })

      it('should use the default eslint if eslint option not provided', () => {
        const linterSpy = jest.spyOn(lintLib, 'linter').mockReturnThis()
        const linter = new TSStandard()
        expect(linter).toBeDefined()
        expect(linterSpy).toHaveBeenCalledTimes(1)
        expect((linterSpy.mock.calls[0][0] as Options).eslint).toEqual(eslint)
      })

      it('should throw error if no project file can be found', () => {
        jest
          .spyOn(defaultOptions, 'getDefaultOptions')
          .mockReturnValue(undefined as any)
        jest
          .spyOn(packageOptions, 'getPackageOptions')
          .mockReturnValue(undefined as any)
        expect.assertions(1)

        try {
          new TSStandard() // eslint-disable-line no-new
        } catch (e) {
          expect(e.message).toMatch(/unable to locate the project file/gi)
        }
      })
    })

    describe('lintText', () => {
      let tsStandard: TSStandard
      const defaultOptions = {
        fix: true,
        globals: ['$'],
        plugins: ['webpack'],
        envs: ['node', 'browser'],
        parser: 'babel'
      }
      const lintTextSpy = jest.fn()
      beforeEach(() => {
        jest.spyOn(lintLib, 'linter').mockReturnValue({
          lintText: lintTextSpy
        } as any)
        tsStandard = new TSStandard({
          ...defaultOptions,
          project: '../tsconfig.eslint.json'
        })
      })

      it('should lint the given text with default options', async (): Promise<
      void
      > => {
        const text = 'The darkside is strong in this one.'
        lintTextSpy.mockImplementationOnce((text, options, cb) =>
          cb(undefined, 'success!')
        )
        const res = await tsStandard.lintText(text)

        expect(res).toEqual('success!')
        expect(lintTextSpy).toHaveBeenCalledTimes(1)
        expect(lintTextSpy.mock.calls[0][0]).toEqual(text)
        expect(lintTextSpy.mock.calls[0][1]).toEqual(defaultOptions)
      })

      it('should overide default options with method options', async (): Promise<
      void
      > => {
        const text = 'The darkside is strong in this one.'
        lintTextSpy.mockImplementationOnce((text, options, cb) =>
          cb(undefined, 'success!')
        )
        const newOptions = {
          fix: false,
          globals: ['jquery'],
          plugins: undefined,
          envs: ['browser'],
          parser: 'typescript'
        }
        const res = await tsStandard.lintText(text, newOptions)

        expect(res).toEqual('success!')
        expect(lintTextSpy).toHaveBeenCalledTimes(1)
        expect(lintTextSpy.mock.calls[0][0]).toEqual(text)
        expect(lintTextSpy.mock.calls[0][1]).toEqual(newOptions)
      })

      it('should return error if linting failed', async (): Promise<void> => {
        const text = 'The darkside is strong in this one.'
        lintTextSpy.mockImplementationOnce((text, options, cb) =>
          cb(new Error('the darkside'))
        )
        expect.assertions(2)

        try {
          await tsStandard.lintText(text)
        } catch (e) {
          expect(lintTextSpy).toHaveBeenCalledTimes(1)
          expect(e.message).toMatch(/the darkside/gi)
        }
      })
    })

    describe('lintFiles', () => {
      let tsStandard: TSStandard
      const defaultOptions = {
        fix: true,
        globals: ['$'],
        plugins: ['webpack'],
        envs: ['node', 'browser'],
        parser: 'babel'
      }
      const lintFilesSpy = jest.fn()
      beforeEach(() => {
        jest.spyOn(lintLib, 'linter').mockReturnValue({
          lintFiles: lintFilesSpy
        } as any)
        tsStandard = new TSStandard({
          ...defaultOptions,
          project: '../tsconfig.eslint.json'
        })
      })

      it('should lint the given files with default options', async (): Promise<
      void
      > => {
        const files = ['The darkside is strong in this one.']
        lintFilesSpy.mockImplementationOnce((files, options, cb) =>
          cb(undefined, 'success!')
        )
        const res = await tsStandard.lintFiles(files)

        expect(res).toEqual('success!')
        expect(lintFilesSpy).toHaveBeenCalledTimes(1)
        expect(lintFilesSpy.mock.calls[0][0]).toEqual(files)
        expect(lintFilesSpy.mock.calls[0][1]).toEqual(defaultOptions)
      })

      it('should overide default options with method options', async (): Promise<
      void
      > => {
        const files = ['The darkside is strong in this one.']
        lintFilesSpy.mockImplementationOnce((files, options, cb) =>
          cb(undefined, 'success!')
        )
        const newOptions = {
          fix: false,
          globals: ['jquery'],
          plugins: undefined,
          envs: ['browser'],
          parser: 'typescript'
        }
        const res = await tsStandard.lintFiles(files, newOptions)

        expect(res).toEqual('success!')
        expect(lintFilesSpy).toHaveBeenCalledTimes(1)
        expect(lintFilesSpy.mock.calls[0][0]).toEqual(files)
        expect(lintFilesSpy.mock.calls[0][1]).toEqual(newOptions)
      })

      it('should return error if linting failed', async (): Promise<void> => {
        const files = ['The darkside is strong in this one.']
        lintFilesSpy.mockImplementationOnce((files, options, cb) =>
          cb(new Error('the darkside'))
        )
        expect.assertions(2)

        try {
          await tsStandard.lintFiles(files)
        } catch (e) {
          expect(lintFilesSpy).toHaveBeenCalledTimes(1)
          expect(e.message).toMatch(/the darkside/gi)
        }
      })
    })
  })
})
