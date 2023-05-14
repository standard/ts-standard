# Contributing

I welcome all pull requests. Please make sure you add appropriate test cases for any features
added.

> New to contributing? Check out [this How to Contribute guide](https://opensource.guide/how-to-contribute/).

## Setup

It is assumed that you already have a copy of this project.

To setup your development environment, run the following command inside the project folder:

```sh
npm install
```

This will install the required tools, dependencies, and git hooks.

## Committing

We follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) and this is enforced by commitlint. Commits with incorrectly formatted messages will result in an error from git and the commit to be rejected.

When committing, tests and linters are also run. If any of them fail, git will throw an error and the commit will be rejected.

> Note that linters are run with the `--fix` argument, so any fixable issues will be fixed automatically.
