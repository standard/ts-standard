[![Tests](https://github.com/standard/ts-standard/workflows/tests/badge.svg?branch=master)](https://github.com/standard/ts-standard/actions?query=workflow%3A%22tests%22)
[![npm](https://badgen.net/npm/v/ts-standard)](https://www.npmjs.com/package/ts-standard)
[![npm](https://badgen.net/npm/dm/ts-standard)](https://www.npmjs.com/package/ts-standard)
[![License](https://badgen.net/github/license/standard/ts-standard)](https://github.com/standard/ts-standard/blob/master/LICENSE)
[![TS-Standard - TypeScript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)
[![Dependabot badge](https://badgen.net/github/dependabot/standard/ts-standard?icon=dependabot)](https://dependabot.com/)

# ts-standard

TypeScript Style Guide, with linter and automatic code fixer based on [StandardJS](https://standardjs.com/)

## 💾 Install

`npm install --save-dev ts-standard`

## ⌨️ Basic Usage

```sh
ts-standard
```

Enable auto code fixing

```sh
ts-standard --fix
```

Note: A `tsconfig.json` or similar project file is required. See
**[TSConfig](https://github.com/standard/ts-standard#-tsconfig-linting-with-type-information)**
section below for more details

## 📜 Help

```text
ts-standard - Standard for TypeScript! (https://github.com/standard/ts-standard)

Usage:
  ts-standard <flags> [FILES...]

  If FILES is omitted, all JavaScript/TypeScript source files (*.js, *.jsx, *.mjs, *.cjs, *.ts, *.tsx)
  in the current working directory are checked, recursively.

  Certain paths (node_modules/, coverage/, vendor/, *.min.js, and
  files/folders that begin with '.' like .git/) are automatically ignored.

  Paths in a project's root .gitignore file are also automatically ignored.

Flags:
      --fix       Automatically fix problems
  -p, --project   Specify ts-config location (default: ./tsconfig.eslint.json or ./tsconfig.json)
      --version   Show current version
  -h, --help      Show usage information

Flags (advanced):
      --stdin     Read file text from stdin
      --ext       Specify JavaScript/TypeScript file extensions
      --global    Declare global variable
      --plugin    Use custom eslint plugin
      --env       Use custom eslint environment
      --parser    Use custom ts/js parser (default: @typescript-eslint/parser)

```

## 🧬 TSConfig: Linting with Type Information

By default `ts-standard` will search the current working director (cwd) for the following in order

1. `tsconfig.eslint.json`
2. `tsconfig.json`

You can also manually configure the location of the `tsconfig` file by either passing the path to
the `--project` flag or adding a `ts-standard` configuration property to your `package.json` file.

```json
{
  "ts-standard": {
    "project": "path/to/tsconfig.json"
  }
}
```

## 🗑 Ignoring files and folders

You can add an `ignore` property to your `package.json` `ts-standard` configuration settings.

```json
{
  "ts-standard": {
    "ignore": [
      "dist",
      "src/**/*.js"
    ]
  }
}
```

## 🚫 Please change X rule

This project has no control over the rules implemented, as such this project cannot change any of the
rules that have been configured. If you want to discuss the rules, please visit the rules configuration repo
[`eslint-config-standard-with-typescript`](https://github.com/standard/eslint-config-standard-with-typescript).

## 🧙 Why

This utility was designed to be the [`standard`](https://github.com/standard/standard) equivalent for typescript.
Underneath the hood, this utility uses the same [`standard-engine`](https://github.com/standard/standard-engine)
and combines that engine with the official
[`eslint-config-standard-with-typescript`](https://github.com/standard/eslint-config-standard-with-typescript)
ruleset.

You can also choose to just use [`eslint`](https://github.com/eslint/eslint) with the
`eslint-config-standard-with-typescript` shareable config instead and achieve the same results as
this project. But `ts-standard` saves you from having to manually install all the extra dependencies
and may reduce configuration overhead.

## 🎉 Special Thanks

Special thanks to [`standard`](https://github.com/standard/standard) for inspiration and some shared code and
to [`eslint-config-standard-with-typescript`](https://github.com/standard/eslint-config-standard-with-typescript) for
creating a typescript specific standard.

## 📋 Contributing Guide

I welcome all pull requests. Please make sure you add appropriate test cases for any features
added. Before opening a PR please make sure to run the following scripts:

- `npm run lint:standard` checks for code errors and format according to [standard](https://github.com/standard/standard)
- `npm test` make sure all tests pass
