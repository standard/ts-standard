import * as lib from './index'

describe('index', () => {
  it('should export the TSStandard class', () => {
    expect(lib).toHaveProperty('TSStandard')
    expect(lib.TSStandard).toBeDefined()
  })

  it('should export the necessary standard-engine compliant api', () => {
    expect(lib).toHaveProperty('parseOpts')
    expect(lib.parseOpts).toBeDefined()
    expect(lib).toHaveProperty('lintText')
    expect(lib.lintText).toBeDefined()
    expect(lib).toHaveProperty('lintFiles')
    expect(lib.lintFiles).toBeDefined()
  })
})
