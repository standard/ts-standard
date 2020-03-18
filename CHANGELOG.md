# Changelog

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
