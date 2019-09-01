# Changelog

## 1.0.2 - Pending

-- **Tests**: Added more test cases and improved overall code coverage

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
