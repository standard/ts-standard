import { CLI } from './cli'
import { getOptions } from './options'

export async function run (): Promise<void> {
  const options = getOptions()
  await CLI(options)
}
