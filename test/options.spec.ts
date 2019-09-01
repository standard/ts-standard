import * as sinon from 'sinon'
import { assert } from 'chai'
import { assertNotUndefined } from './assert'
import { TSConfig } from '../src/tsconfig'
import * as optionsLib from '../src/options'

describe('options', () => {
  describe('getOptions', (): void => {
    let getTSConfigFileStub: sinon.SinonStub<any, any>

    before((): void => {
      getTSConfigFileStub = sinon.stub(TSConfig.prototype, 'getConfigFilePath')
    })

    after((): void => {
      sinon.restore()
    })

    afterEach((): void => {
      sinon.resetHistory()
      sinon.resetBehavior()
    })

    it('should return the correct options', async (): Promise<void> => {
      const projectPath = 'some/project.path'
      getTSConfigFileStub.returns(projectPath)
      const options = await optionsLib.getOptions()
      assert.equal(options.cmd, 'ts-standard')
      assert.equal(options.version, require('../package.json').version)
      assert.equal(options.homepage, require('../package.json').homepage)
      assert.equal(options.bugs, require('../package.json').bugs.url)
      assert.equal(options.tagline, 'Standard for Typescript!')
      assert.ok(options.eslint)
      assert.ok(options.eslintConfig.configFile)
      options.eslintConfig.configFile = assertNotUndefined(options.eslintConfig.configFile)
      assert.match(options.eslintConfig.configFile, /eslintrc\.json/gi)
      assert.ok(options.eslintConfig.parserOptions)
      options.eslintConfig.parserOptions = assertNotUndefined(options.eslintConfig.parserOptions)
      assert.equal(options.eslintConfig.parserOptions.project, projectPath)
    })
  })
})
