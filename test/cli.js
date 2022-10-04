import { fileURLToPath } from 'node:url'

import test from 'tape'
import crossSpawn from 'cross-spawn'
import options from '../options.js'

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

test('command line usage: --version', (t) => {
  t.plan(2)

  const child = crossSpawn(CLI_PATH, ['--version'])
  child.on('error', (err) => {
    t.fail(err)
  })

  child.stdout.on('data', (data) => {
    t.equal(data.toString().trim(), options.version, 'version matches')
  })

  child.on('close', (code) => {
    t.equal(code, 0, 'zero exit code')
  })
})
