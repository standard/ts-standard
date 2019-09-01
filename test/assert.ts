export function assertNotUndefined<T> (value: T | undefined): T {
  if (value === undefined) {
    throw new TypeError('Expected value to !== undefined.')
  }
  return value
}
