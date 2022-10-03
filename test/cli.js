import { fileURLToPath } from 'node:url'

import test from 'tape'
import crossSpawn from 'cross-spawn'

const CLI_PATH = fileURLToPath(new URL('../cli.js', import.meta.url))

test('command line usage: --help', (t) => {
  t.plan(1)

  const child = crossSpawn(CLI_PATH, ['--help'])
  child.on('error', (err) => {
    t.fail(err)
  })
  child.on('close', (code) => {
    t.equal(code, 0, 'zero exit code')
  })
})
