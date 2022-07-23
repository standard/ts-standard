import test from 'tape'

import tsStandard from '../index.js'

test('load config in eslint to validate all rule syntax is correct', async (t) => {
  t.plan(1)
  const code = 'const foo = 1\nconst bar = function () {}\nbar(foo)\n'
  const [result] = await tsStandard.lintText(code)
  t.equal(result.errorCount, 0)
})

test('ensure we allow top level await', async (t) => {
  t.plan(1)
  const code =
    'const foo = await 1\nconst bar = function () {}\nawait bar(foo)\n'
  const [result] = await tsStandard.lintText(code)
  t.equal(result.errorCount, 0)
})

test('lint correctly fixtures/typescript-with-errors.ts', async (t) => {
  const [result] = await tsStandard.lintFiles(
    ['test/fixtures/typescript-with-errors.ts'],
    { usePackageJson: false }
  )
  t.equal(typeof result, 'object', 'result is an object')
  t.equal(result.errorCount, 1)
  t.equal(result.messages.length, 1)
  t.equal(result.messages[0].ruleId, '@typescript-eslint/explicit-function-return-type')
})

test('lint correctly fixtures/typescript-no-errors.ts', async (t) => {
  const [result] = await tsStandard.lintFiles(
    ['test/fixtures/typescript-no-errors.ts'],
    { usePackageJson: false }
  )
  t.equal(typeof result, 'object', 'result is an object')
  t.equal(result.errorCount, 0)
})
