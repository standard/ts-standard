// programmatic usage
import { linter as Linter } from 'standard-engine'
import { getOptions } from './options'

module.exports = new Linter(getOptions())
