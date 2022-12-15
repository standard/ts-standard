# Changelog

## 13.0.0 - Pending

## 12.0.2

- **Fix:** Allow absolute `--project` path [(#269)](https://github.com/standard/ts-standard/pull/269).

## 12.0.1

- **Fix:** Process `--version` Flag Directly without the need of `--project` option [(#264)](https://github.com/standard/ts-standard/pull/264).

## 12.0.0

- **BREAKING:** Major rewrite of `ts-standard` to follow the structure of other `standard` engines (like `standard`, `semistandard`, `standardx`).
- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^23.0.0`. Please visit their github page for any style/linter changes.
- **BREAKING**: Dropped support for many options (e.g: `--cwd`), these options should now be implemented in `standard-engine`.
- **BREAKING**: Dropped support for multiple tsconfig projects to be used (need to be rethought, please open an issue, if you really need this feature, explaining why you need this use case).

## 11.0.0

- **BREAKING**: Dropped support for NodeJS `10.x` (Minimum supported version is `12.x`)
- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^21.0.1`. Please visit
their github page for any style/linter changes
- **BREAKING**: Updated `eslint-config-standard` to version `^16.0.3`. Please visit
their github page for any style/linter changes
- **Fix**: typo `reqired` to `required`
- **Feature**: Add support for multiple tsconfig projects to be used

## 10.0.0

- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^19.0.1`. Please visit
their github page for any style/linter changes
- **BREAKING**: Updated `eslint-config-standard` to version `^16.0.2`. Please visit
their github page for any style/linter changes
- **BREAKING**: Updated `eslint-config-standard-jsx` to version `^10.0.0`. Please visit
their github page for any style/linter changes
- **BREAKING**: Updated `standard-engine` dependency to `^14.0.0`
- **BREAKING**: Updated `@typescript-eslint/eslint-plugin` dependency to `^4.8.2`
- **Feature**: Added new `--stdin-filename` cli option so that the `--stdin` flag is actually usable.
See this [issue](https://github.com/typescript-eslint/typescript-eslint/issues/885) for more info.
- **Feature**: Added new `--extensions` option for customizing the default linted file extensions.
`.ts` and `.tsx` are added by default to the existing standard default ones (`js`, `jsx`, `cjs`, `mjs`)

## 9.0.0

- **BREAKING**: Dropped support for NodeJS `8.x`
- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^18.0.0`. Please visit
their github page for any style/linter changes
- **BREAKING**: Updated `eslint` to version `^7.0.0` (from `6.0.0`)
- **BREAKING**: Updated `@typescript-eslint/eslint-plugin` to version `^7.6.0` (from `6.0.0`)
- **Chore**: Updated a number of devDependencies
- **Feature**: Added prettier for formatting before standard fixing

## 8.0.1

- **Change**: Updated minimum typescript version to `>=3.8` (Note: this requirement already existed
with `8.0.0`, it just was not explicitly set in the `package.json` as it should have been)
- **Fix**: Pass working directory (cwd) option to eslint constructor
- **Chore**: Update explicit minimum required versions for regular dependencies

## 8.0.0

- **BREAKING**: Changed the default linter output format to now include rule name by default. The
verbose cli option has been removed.
- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^16.0.0`. Please visit
their github page for any style/linter changes
- **REFACTOR**: Completely refactored every aspect of the entire library. Many new test cases added,
better code architecture, exported `standard-engine` compliant API and easy to use `TSStandard` class
- **Feature**: Added the ability to select the report style of linter output. You can use a
built-in eslint formatter/reporter or use your own eslint custom reporter. The option can be set via
CLI flag or `package.json`. CLI flag will override `package.json` value.
- **Feature**: Added the ability to enable/disable `fix` from `package.json`. CLI flag
will override `package.json` value.
- **Change**: Converted over to using `jest` for tests, assertions, mocks, and code coverage.

## 7.0.0

- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^15.0.0`. Please visit
their github page for any style/linter changes

## 6.0.0

- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^14.0.0`. Please visit
their github page for any style/linter changes

## 5.0.0

- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^13.0.0`. Please visit
their github page for any style/linter changes
- **Feature**: added support for linting .tsx files by default

## 4.0.0

- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^12.0.1`. Please visit
their github page for any style/linter changes
- **Upgrade**: Updated devDependency `@types/mocha`
- **Docs**: Simplified execution command in the docs to make it more friendly to new users

## 3.1.0

- **Upgrade**: Updated the following dependencies: `eslint-plugin-node`, `sinon`, `nyc`, `mocha`, `husky`
- **Change**: Removed dependency on `@typescript-eslint/parser` as it is now a dependency of
`eslint-config-standard-with-typescript`

## 3.0.0

- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^11.0.1`. Please visit
their github page for any style/linter changes

## 2.0.0

- **BREAKING**: Updated `eslint-config-standard-with-typescript` to version `^10.0.0`. Please visit
their github page for any style/linter changes
- **Change**: Updated fetching package settings to use a synchronous call. This means that fetching
options provided to ts-standard is now a synchronous operation
- Tests: Added more test cases and improved overall code coverage

## 1.0.1

- **Change**: Updates to readme file and badges
- **Change**: Updated `eslint-config-standard-with-typescript` away from custom branch back to the
official version ^9.0.0

## 1.0.0

- Initial release
- Utilizes the official `eslint-config-standard-with-typescript` ruleset
- Adds the `--project` option to the cli to specify a `tsconfig.json` config file
- Automatically searches a projects root directory for a `tsconfig.json` or `tsconfig.eslint.json` file to
eliminate the need to specify the option explicitly
- Supports all the same options that `standard` normal CLI supports thanks to `standard-engine`
- Supports configuration via `ts-standard` property in a `package.json` file
