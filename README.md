[![Tests](https://github.com/standard/ts-standard/workflows/tests/badge.svg?branch=master)](https://github.com/standard/ts-standard/actions?query=workflow%3A%22tests%22)
[![Coverage Status](https://coveralls.io/repos/github/standard/ts-standard/badge.svg?branch=master)](https://coveralls.io/github/standard/ts-standard?branch=master)
[![npm](https://badgen.net/npm/v/ts-standard)](https://www.npmjs.com/package/ts-standard)
[![npm](https://badgen.net/npm/dm/ts-standard)](https://www.npmjs.com/package/ts-standard)
[![License](https://badgen.net/github/license/standard/ts-standard)](https://github.com/standard/ts-standard/blob/master/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)
[![Dependabot badge](https://badgen.net/github/dependabot/standard/ts-standard?icon=dependabot)](https://dependabot.com/)

# ts-standard

TypeScript Style Guide, with linter and automatic code fixer based on [StandardJS](https://standardjs.com/)

## 💾 Install

`npm install ts-standard`

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
ts-standard - Standard for Typescript! (https://github.com/standard/ts-standard)

Usage:
    ts-standard <flags> [FILES...]
    If FILES is omitted, all JavaScript/Typescript source files (*.js, *.jsx, *.mjs, *.cjs, *.ts)
    in the current working directory are checked, recursively.
    Certain paths (node_modules/, coverage/, vendor/, *.min.js, bundle.js, and
    files/folders that begin with '.' like .git/) are automatically ignored.
    Paths in a project's root .gitignore file are also automatically ignored.
Flags:
        --fix           Automatically fix problems
    -p, --project       Specify ts-config location (default: ./tsconfig.eslint.json or ./tsconfig.json)
        --version       Show current version
    -h, --help          Show usage information
Flags (advanced):
        --stdin         Read file text from stdin
        --globals       Declare global variable
        --plugins       Use custom eslint plugin
        --envs          Use custom eslint environment
        --parser        Use custom ts/js parser (default: @typescript-eslint/parser)
        --report        Use a built-in eslint reporter or custom eslint reporter (default: standard)
 --ext, --extensions    List of files extensions to lint by default (default: js,jsx,ts,tsx,mjs,cjs)
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

Its possible to specify multiple projects using an array as in the underlying
[parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#parseroptionsproject).

## 🗑 Ignoring files and folders

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

## 🎛 Package.json Options

```jsonc
{
  "ts-standard": {
    "ignore": [""],             // files/folders/globs to ignore
    "noDefaultIgnore": false,   // disable ignoring default locations (e.g. node_modules, .git, etc...)
    "globals": [""],            // global variables to define (e.g. $, jquery, etc...)
    "plugins": [""],            // Extra eslint plugins to use
    "envs": [""],               // eslint environments to use (e.g. node, browser, etc...)
    "parser": "",               // a different eslint parser to use (e.g. babel, etc...)
    "cwd": "",                  // the root working directory where the project file is located
    "eslint": "",               // path to a custom eslint linter
    "files": [""],              // files/folders/globs to include in the linting
    "project": [""],            // relative path to `tsconfig.json` file
    "fix": false,               // auto fix any lint errors found that are fixable
    "report": "",               // an eslint formatter to output the lint results as (e.g. standard, stylish, json, etc...)
    "extensions": "",           // a list of file extensions to lint by default (e.g. js,jsx,ts,tsx,mjs,cjs)
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

- `npm run lint` checks for code errors and format according to [ts-standard](https://github.com/standard/ts-standard)
- `npm test` make sure all tests pass
- `npm run coverage` make sure the coverage has not decreased from current master
