import type {
  lintFiles as lintFilesType,
  lintText as lintTextType,
  parseOpts as parseOptsType
} from './standard-engine-api'
import * as tsStandardLib from './ts-standard'

let parseOpts: typeof parseOptsType,
  lintFiles: typeof lintFilesType,
  lintText: typeof lintTextType
jest.mock('standard-engine')

const customEslint = jest.fn().mockReturnThis()
jest.mock('custom-eslint', () => customEslint, { virtual: true })

describe('standard-engine-api', () => {
  beforeEach(() => {
    jest.isolateModules(() => {
      ;({ parseOpts, lintFiles, lintText } = require('./standard-engine-api'))
    })
  })

  describe('parseOpts', () => {
    it('should initialize a new ts-standard linter with the given settings', () => {
      const tsStandardSpy = jest
        .spyOn(tsStandardLib, 'TSStandard')
        .mockReturnThis()
      const options = {
        cwd: '/some/cwd',
        filename: 'file:///jedi/yoda.ts'
      }
      const res = parseOpts(options)
      expect(res).toEqual(options)
      expect(tsStandardSpy).toHaveBeenCalledTimes(1)
      expect(tsStandardSpy).toHaveBeenCalledWith({
        cwd: options.cwd
      })
    })

    it('should use cached ts-standard instance on subsequent calls', () => {
      const tsStandardSpy = jest
        .spyOn(tsStandardLib, 'TSStandard')
        .mockReturnThis()
      const options = {
        cwd: '/some/cwd',
        filename: 'file:///jedi/yoda.ts'
      }
      const res = parseOpts(options)
      const res2 = parseOpts(options)
      expect(res).toEqual(options)
      expect(res2).toEqual(options)
      expect(tsStandardSpy).toHaveBeenCalledTimes(1)
      expect(tsStandardSpy).toHaveBeenCalledWith({
        cwd: options.cwd
      })
    })

    it('should use re-initialize ts-standard instance if cwd changes', () => {
      const tsStandardSpy = jest
        .spyOn(tsStandardLib, 'TSStandard')
        .mockReturnThis()
      const options = {
        cwd: '/some/cwd',
        filename: 'file:///jedi/yoda.ts'
      }
      const res = parseOpts(options)
      const options2 = {
        cwd: '/some/other/cwd',
        filename: 'file:///jedi/obi-wan.ts'
      }
      const res2 = parseOpts(options2)

      expect(tsStandardSpy).toHaveBeenCalledTimes(2)
      expect(res).toEqual(options)
      expect(tsStandardSpy).toHaveBeenNthCalledWith(1, {
        cwd: options.cwd
      })
      expect(res2).toEqual(options2)
      expect(tsStandardSpy).toHaveBeenNthCalledWith(2, {
        cwd: options2.cwd
      })
    })
  })

  describe('lintText', () => {
    const options = {
      fix: true,
      globals: ['$'],
      plugins: ['webpack'],
      envs: ['node', 'browser'],
      parser: 'babel'
    }
    let tsStandardSpy: jest.SpyInstance
    const lintTextSpy = jest.fn()
    beforeEach(() => {
      tsStandardSpy = jest
        .spyOn(tsStandardLib, 'TSStandard')
        .mockReturnValueOnce({
          lintText: lintTextSpy
        } as any)
    })

    it('should lint the given text without providing options', (cb): void => {
      const text = 'The darkside is strong in this one.'
      lintTextSpy.mockResolvedValueOnce('success!')

      expect.assertions(6)
      lintText(text, (err, res) => {
        try {
          expect(err).toBeUndefined()
          expect(res).toEqual('success!')
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          expect(lintTextSpy).toHaveBeenCalledTimes(1)
          expect(lintTextSpy.mock.calls[0][0]).toEqual(text)
          expect(lintTextSpy.mock.calls[0][1]).toBeDefined()
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })

    it('should lint the given text with the given options', (cb): void => {
      const text = 'The darkside is strong in this one.'
      lintTextSpy.mockResolvedValueOnce('success!')

      expect.assertions(6)
      lintText(text, options, (err, res) => {
        try {
          expect(err).toBeUndefined()
          expect(res).toEqual('success!')
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          expect(lintTextSpy).toHaveBeenCalledTimes(1)
          expect(lintTextSpy.mock.calls[0][0]).toEqual(text)
          expect(lintTextSpy.mock.calls[0][1]).toEqual(options)
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })

    it('should used cached ts-standard instance if it exists', (cb): void => {
      const text = 'The darkside is strong in this one.'
      lintTextSpy.mockResolvedValueOnce('success!')

      expect.assertions(3)
      parseOpts({})
      expect(tsStandardSpy).toHaveBeenCalledTimes(1)
      lintText(text, options, (err) => {
        try {
          expect(err).toBeUndefined()
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })

    it('should return an error if linting failed', (cb): void => {
      const text = 'The darkside is strong in this one.'
      lintTextSpy.mockRejectedValueOnce(new Error('the darkside'))

      expect.assertions(3)
      lintText(text, options, (err, res) => {
        try {
          expect(err?.message).toMatch(/the darkside/gi)
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          expect(res).toBeUndefined()
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })

    it('should replace any uri tokens in filename if provided', (cb): void => {
      const text = 'The darkside is strong in this one.'
      lintTextSpy.mockResolvedValueOnce('success!')

      expect.assertions(6)
      lintText(
        text,
        {
          filename: 'file:///some/path/to/the/darkside'
        },
        (err, res) => {
          try {
            expect(err).toBeUndefined()
            expect(res).toEqual('success!')
            expect(tsStandardSpy).toHaveBeenCalledTimes(1)
            expect(lintTextSpy).toHaveBeenCalledTimes(1)
            expect(lintTextSpy.mock.calls[0][0]).toEqual(text)
            expect(lintTextSpy.mock.calls[0][1].filename).toEqual(
              '/some/path/to/the/darkside'
            )
            cb()
          } catch (e) {
            cb(e)
          }
        }
      )
    })
  })

  describe('lintFiles', () => {
    const options = {
      fix: true,
      globals: ['$'],
      plugins: ['webpack'],
      envs: ['node', 'browser'],
      parser: 'babel'
    }
    let tsStandardSpy: jest.SpyInstance
    const lintFilesSpy = jest.fn()
    beforeEach(() => {
      tsStandardSpy = jest
        .spyOn(tsStandardLib, 'TSStandard')
        .mockReturnValueOnce({
          lintFiles: lintFilesSpy
        } as any)
    })

    it('should lint the given files without providing options', (cb): void => {
      const files = ['The darkside is strong in this one.']
      lintFilesSpy.mockResolvedValueOnce('success!')

      expect.assertions(6)
      lintFiles(files, (err, res) => {
        try {
          expect(err).toBeUndefined()
          expect(res).toEqual('success!')
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          expect(lintFilesSpy).toHaveBeenCalledTimes(1)
          expect(lintFilesSpy.mock.calls[0][0]).toEqual(files)
          expect(lintFilesSpy.mock.calls[0][1]).toBeDefined()
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })

    it('should lint the given files with the given options', (cb): void => {
      const files = ['The darkside is strong in this one.']
      lintFilesSpy.mockResolvedValueOnce('success!')

      expect.assertions(6)
      lintFiles(files, options, (err, res) => {
        try {
          expect(err).toBeUndefined()
          expect(res).toEqual('success!')
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          expect(lintFilesSpy).toHaveBeenCalledTimes(1)
          expect(lintFilesSpy.mock.calls[0][0]).toEqual(files)
          expect(lintFilesSpy.mock.calls[0][1]).toEqual(options)
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })

    it('should used cached ts-standard instance if it exists', (cb): void => {
      const files = ['The darkside is strong in this one.']
      lintFilesSpy.mockResolvedValueOnce('success!')

      expect.assertions(3)
      parseOpts({})
      expect(tsStandardSpy).toHaveBeenCalledTimes(1)
      lintFiles(files, options, (err) => {
        try {
          expect(err).toBeUndefined()
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })

    it('should return an error if linting failed', (cb): void => {
      const files = ['The darkside is strong in this one.']
      lintFilesSpy.mockRejectedValueOnce(new Error('the darkside'))

      expect.assertions(3)
      lintFiles(files, options, (err, res) => {
        try {
          expect(err?.message).toMatch(/the darkside/gi)
          expect(tsStandardSpy).toHaveBeenCalledTimes(1)
          expect(res).toBeUndefined()
          cb()
        } catch (e) {
          cb(e)
        }
      })
    })
  })
})
