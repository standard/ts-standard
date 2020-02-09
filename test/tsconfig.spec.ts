import * as sinon from 'sinon'
import { assert } from 'chai'
import { join } from 'path'
import * as pkgConfLib from 'pkg-conf'
import { assertNotUndefined } from './assert'
import { TSConfig } from '../src/tsconfig'

describe('tsconfig', () => {
  let tsConfig: TSConfig
  before(() => {
    tsConfig = new TSConfig()
  })

  describe('_isValidPath', () => {
    it('should return true for a valid path', () => {
      const validPath = join(__dirname, '/options.spec.ts')
      const isValid = tsConfig._isValidPath(validPath)
      assert.isTrue(isValid)
    })

    it('should return false for an invalid path', () => {
      const invalidPath = join(__dirname, '/non-existent-file.ts')
      const isValid = tsConfig._isValidPath(invalidPath)
      assert.isFalse(isValid)
    })
  })

  describe('_getTSConfigFromDefaultLocations', (): void => {
    let _isValidPathStub: sinon.SinonStub<any, any>

    before((): void => {
      _isValidPathStub = sinon.stub(tsConfig, '_isValidPath')
    })

    after((): void => {
      sinon.restore()
    })

    afterEach((): void => {
      sinon.resetHistory()
      sinon.resetBehavior()
    })

    it('should return a valid path if one is found found', (): void => {
      _isValidPathStub.returns(true)
      let validPath = tsConfig._getTSConfigFromDefaultLocations()
      validPath = assertNotUndefined(validPath)
      assert.match(validPath, /tsconfig\.eslint\.json/gi)
    })

    it('should return the first path found if a valid path is found', (): void => {
      _isValidPathStub.returns(false)
      _isValidPathStub.onSecondCall().returns(true)
      let validPath = tsConfig._getTSConfigFromDefaultLocations()
      validPath = assertNotUndefined(validPath)
      assert.match(validPath, /tsconfig\.json/gi)
    })

    it('should return undefined if no valid path found', (): void => {
      _isValidPathStub.returns(false)
      const validPath = tsConfig._getTSConfigFromDefaultLocations()
      assert.isUndefined(validPath)
    })
  })

  describe('_getTSConfigPathFromSettings', (): void => {
    let _pkgConfStub: sinon.SinonStub<any, any>

    before((): void => {
      _pkgConfStub = sinon.stub(pkgConfLib, 'sync')
    })

    after((): void => {
      sinon.restore()
    })

    afterEach((): void => {
      sinon.resetHistory()
      sinon.resetBehavior()
    })

    it('should return a valid path if one is found found', async (): Promise<void> => {
      _pkgConfStub.returns({ project: './tsconfig.eslint.json' })
      let validPath = await tsConfig._getTSConfigPathFromSettings()
      validPath = assertNotUndefined(validPath)
      assert.match(validPath, /tsconfig.eslint.json/gi)
    })

    it('should return undefined if no valid path found', async (): Promise<void> => {
      _pkgConfStub.returns({ project: './non-existent-file.ts' })
      const validPath = await tsConfig._getTSConfigPathFromSettings()
      assert.isUndefined(validPath)
    })

    it('should return undefined if project settings provided', async (): Promise<void> => {
      _pkgConfStub.returns({})
      const validPath = await tsConfig._getTSConfigPathFromSettings()
      assert.isUndefined(validPath)
    })
  })

  describe('getConfigFilePath', (): void => {
    let _getTSConfigPathFromSettingsStub: sinon.SinonStub<any, any>
    let _getTSConfigFromDefaultLocationsStub: sinon.SinonStub<any, any>
    const packageJsonPath = '/path/from/package.json'
    const defaultLocationPath = '/path/from/default-location.json'

    before((): void => {
      _getTSConfigPathFromSettingsStub = sinon.stub(tsConfig, '_getTSConfigPathFromSettings')
      _getTSConfigFromDefaultLocationsStub = sinon.stub(tsConfig, '_getTSConfigFromDefaultLocations')
    })

    after((): void => {
      sinon.restore()
    })

    afterEach((): void => {
      sinon.resetHistory()
      sinon.resetBehavior()
    })

    it('should return a valid path from package.json first', async (): Promise<void> => {
      _getTSConfigPathFromSettingsStub.returns(packageJsonPath)
      _getTSConfigFromDefaultLocationsStub.returns(defaultLocationPath)
      let validPath = await tsConfig.getConfigFilePath()
      validPath = assertNotUndefined(validPath)
      assert.equal(validPath, packageJsonPath)
    })

    it('should return a valid path from default location if no package.json setting found', async (): Promise<void> => {
      _getTSConfigPathFromSettingsStub.returns(undefined)
      _getTSConfigFromDefaultLocationsStub.returns(defaultLocationPath)
      let validPath = await tsConfig.getConfigFilePath()
      validPath = assertNotUndefined(validPath)
      assert.equal(validPath, defaultLocationPath)
    })

    it('should return undefined if no valid paths found', async (): Promise<void> => {
      _getTSConfigPathFromSettingsStub.returns(undefined)
      _getTSConfigFromDefaultLocationsStub.returns(undefined)
      const validPath = await tsConfig.getConfigFilePath()
      assert.isUndefined(validPath)
    })
  })
})
