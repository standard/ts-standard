export * from './default-options'
export * from './cli-options'
export * from './package-options'

export function mergeOptions (...objects: any[]): any {
  const result: any = {}
  for (const obj of objects) {
    if (obj == null) {
      continue
    }
    const keys = Object.keys(obj)
    for (const key of keys) {
      result[key] = obj[key] ?? result[key]
    }
  }
  return result
}
