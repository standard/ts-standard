"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._convertToArray = exports.getCLIOptions = void 0;
const minimist = require("minimist");
const constants_1 = require("../constants");
function getCLIOptions() {
    // Parse the command line arguments
    const argv = minimist(process.argv.slice(2), {
        alias: {
            globals: 'global',
            plugins: 'plugin',
            envs: 'env',
            help: 'h',
            project: 'p'
        },
        boolean: ['fix', 'help', 'stdin', 'version'],
        string: ['globals', 'plugins', 'parser', 'envs', 'project', 'report']
    });
    // Unix convention: Command line argument `-` is a shorthand for `--stdin`
    if (argv._[0] === '-') {
        argv.stdin = true;
        argv._.shift();
    }
    // Print the help section if so requested
    if (argv.help) {
        console.log('%s - %s (%s)', constants_1.CMD, constants_1.TAGLINE, constants_1.HOMEPAGE);
        console.log(`
Usage:
    ${constants_1.CMD} <flags> [FILES...]
    If FILES is omitted, all JavaScript/Typescript source files (*.js, *.jsx, *.mjs, *.cjs, *.ts, *.tsx)
    in the current working directory are checked, recursively.
    Certain paths (node_modules/, coverage/, vendor/, *.min.js, bundle.js, and
    files/folders that begin with '.' like .git/) are automatically ignored.
    Paths in a project's root .gitignore file are also automatically ignored.
Flags:
        --fix       Automatically fix problems
    -p, --project   Specify ts-config location (default: ./tsconfig.eslint.json or ./tsconfig.json)
        --version   Show current version
    -h, --help      Show usage information
Flags (advanced):
        --stdin     Read file text from stdin
        --globals   Declare global variable
        --plugins   Use custom eslint plugin
        --envs      Use custom eslint environment
        --parser    Use custom ts/js parser (default: @typescript-eslint/parser)
        --report    Use a built-in eslint reporter or custom eslint reporter (default: standard)
    `);
        return process.exit(0);
    }
    // Print out the version number if requested
    if (argv.version) {
        console.log(constants_1.VERSION);
        return process.exit(0);
    }
    // Get the files/globs to lint
    const files = argv._.length !== 0 ? argv._ : undefined;
    return {
        fix: argv.fix,
        useStdIn: argv.stdin,
        files,
        project: argv.project,
        globals: exports._convertToArray(argv.globals),
        plugins: exports._convertToArray(argv.plugins),
        envs: exports._convertToArray(argv.envs),
        parser: argv.parser,
        report: argv.report
    };
}
exports.getCLIOptions = getCLIOptions;
function _convertToArray(val) {
    if (val != null && !Array.isArray(val)) {
        return [val];
    }
    if (Array.isArray(val)) {
        return val;
    }
}
exports._convertToArray = _convertToArray;
