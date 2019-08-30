[![Travis](https://travis-ci.org/toddbluhm/env-cmd.svg?branch=master)](https://travis-ci.org/toddbluhm/ts-standard)
[![npm](https://img.shields.io/npm/v/env-cmd.svg?maxAge=86400)](https://www.npmjs.com/package/ts-standard)
[![npm](https://img.shields.io/npm/dm/env-cmd.svg?maxAge=86400)](https://www.npmjs.com/package/ts-standard)
[![npm](https://img.shields.io/npm/l/env-cmd.svg?maxAge=2592000)](https://www.npmjs.com/package/ts-standard)
[![TS-Standard - Typescript Standard Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/toddbluhm/ts-standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/toddbluhm/ts-standard.svg)](https://greenkeeper.io/)

# ts-standard

TypeScript Style Guide, with linter &amp; automatic code fixer based on Standard

## 💾 Install

`npm install ts-standard`

## ⌨️ Basic Usage

```sh
npx ts-standard
```

Enable auto code fixing

```sh
npx ts-standard --fix
```

Note: A `tsconfig.json` or similar project file is required. See **TSConfig** below for more details

## 📜 Help

```
ts-standard - Standard for Typescript! (https://github.com/toddbluhm/ts-standard)

Usage:
    ts-standard <flags> [FILES...]
    If FILES is omitted, all JavaScript/Typescript source files (*.js, *.jsx, *.mjs, *.cjs, *.ts)
    in the current working directory are checked, recursively.
    Certain paths (node_modules/, coverage/, vendor/, *.min.js, bundle.js, and
    files/folders that begin with '.' like .git/) are automatically ignored.
    Paths in a project's root .gitignore file are also automatically ignored.
Flags:
        --fix       Automatically fix problems
    -v, --verbose   Show rule names for errors (to ignore specific rules)
        --version   Show current version
    -h, --help      Show usage information
Flags (advanced):
        --stdin     Read file text from stdin
        --global    Declare global variable
        --plugin    Use custom eslint plugin
        --env       Use custom eslint environment
        --parser    Use custom js parser (e.g. babel-eslint)
    -p, --project   Use custom tsconfig file to get type information
```

## TSConfig: Linting with Type Information 

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

## Ignoring files and folders

You can ignore files and folders by either providing specific files/globs of the files you want linted
to `ts-standard` when running the command or you can add an `ignore` property to your `package.json`
`ts-standard` configuration settings.

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

## Do not like/Please change X rule

This project has no control over the rules implemented, as such this project cannot change any of the
rules that have been setup. If you want to discuss the rules, please visit the rules configuration repo
[`eslint-config-standard-with-typescript`](https://github.com/standard/eslint-config-standard-with-typescript).

## 🧙‍ Why

This utility was designed to be the [`standard`](https://github.com/standard/standard) equivalent for typescript.
Underneath the hood, this utility uses the same [`standard-engine`](https://github.com/standard/standard-engine)
and combines that engine with the official
[`eslint-config-standard-with-typescript`](https://github.com/standard/eslint-config-standard-with-typescript)
ruleset.

You can also choose to just use [`eslint`](https://github.com/eslint/eslint) with the
`eslint-config-standard-with-typescript` shareable config instead and achieve the same results as
this project. But `ts-standard` saves you from having to manually install all the extra dependencies
and may reduce configuration overhead.

## Related Projects

[`standard`](https://github.com/standard/standard) - The original JavaScript Style Guide, with linter & automatic code fixer

[`eslint-config-standard-with-typescript`](https://github.com/standard/eslint-config-standard-with-typescript) - The ruleset configuration used for `ts-standard`

## 🎊 Special Thanks

Special thanks to [`standard`](https://github.com/standard/standard) for inspiration and some shared code.

## 📋 Contributing Guide

I welcome all pull requests. Please make sure you add appropriate test cases for any features
added. Before opening a PR please make sure to run the following scripts:

- `npm run lint` checks for code errors and format according to [ts-standard](https://github.com/toddbluhm/ts-standard)
- `npm test` make sure all tests pass
- `npm run test-cover` make sure the coverage has not decreased from current master
