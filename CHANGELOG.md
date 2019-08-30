# 1.0.0

- Initial release
- Utilizes the official [`eslint-config-standard-with-typescript`](https://github.com/standard/eslint-config-standard-with-typescript) ruleset
- Adds the `--project` option to the cli to specify a `tsconfig.json` config file
- Automatically searches a projects root directory for a `tsconfig.json` or `tsconfig.eslint.json` file to
eliminate the need to specify the option explicitly
- Supports all the same options that `standard` normal CLI supports thanks to `standard-engine`
- Supports configuration via `ts-standard` property in a `package.json` file
