import { mergeOptions } from './index'

describe('options/index.ts', () => {
  describe('mergeOptions', (): void => {
    it('should return the options together ignoring undefined or null keys', (): void => {
      const res = mergeOptions(
        { luke: 'skywalker', leia: undefined },
        { luke: undefined, leia: 'morgana' },
        { vader: 'is your father', leia: undefined }
      )
      expect(res).toEqual({
        luke: 'skywalker',
        leia: 'morgana',
        vader: 'is your father'
      })
    })

    it('should ignore undefined values passed in', (): void => {
      const res = mergeOptions(
        { luke: 'skywalker', leia: undefined },
        undefined,
        { vader: 'is your father', leia: undefined }
      )
      expect(res).toEqual({
        luke: 'skywalker',
        leia: undefined,
        vader: 'is your father'
      })
    })
  })
})
