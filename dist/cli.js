"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const getStdin = require("get-stdin");
const standard_engine_1 = require("standard-engine");
const DEFAULT_PATTERNS = [
    '**/*.js',
    '**/*.jsx',
    '**/*.mjs',
    '**/*.cjs',
    '**/*.ts',
    '**/*.tsx'
];
const ESLINT_BUILTIN_FORMATTERS = [
    'stylish', 'checkstyle', 'codeframe', 'compact',
    'html', 'jslint-xml', 'json', 'junit', 'table',
    'tap', 'unix', 'visualstudio'
];
async function CLI(options) {
    var _a, _b;
    const standard = new standard_engine_1.linter(options);
    // Add in some required options
    options = Object.assign({ cmd: 'standard-engine', tagline: 'JavaScript Custom Style', version: '0.0.0' }, options);
    // Parse the command line arguments
    const argv = minimist(process.argv.slice(2), {
        alias: {
            global: 'globals',
            plugin: 'plugins',
            env: 'envs',
            help: 'h',
            verbose: 'v',
            project: 'p',
            formatter: 'f'
        },
        boolean: [
            'fix',
            'help',
            'stdin',
            'verbose',
            'version'
        ],
        string: [
            'global',
            'plugin',
            'parser',
            'env',
            'project'
        ]
    });
    // Unix convention: Command line argument `-` is a shorthand for `--stdin`
    if (argv._[0] === '-') {
        argv.stdin = true;
        argv._.shift();
    }
    // Print the help section if so requested
    if (argv.help) {
        if (options.tagline !== undefined) {
            console.log('%s - %s (%s)', options.cmd, options.tagline, options.homepage);
        }
        console.log(`
Usage:
    ${options.cmd} <flags> [FILES...]
    If FILES is omitted, all JavaScript/Typescript source files (*.js, *.jsx, *.mjs, *.cjs, *.ts, *.tsx)
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
        --parser    Use custom ts/js parser (default: @typescript-eslint/parser)
    -p, --project   Use custom tsconfig file to get type information
    -f, --formatter Use a built-in eslint formatter or custom eslint formatter (default: stylish)
    `);
        process.exitCode = 0;
        return;
    }
    // Print out the version number if requested
    if (argv.version) {
        console.log(options.version);
        process.exitCode = 0;
        return;
    }
    // Override any previous project setting with the command line argument project setting
    if (argv.project !== undefined) {
        if (options.eslintConfig.parserOptions === undefined) {
            options.eslintConfig.parserOptions = {};
        }
        options.eslintConfig.parserOptions.project = argv.project;
    }
    // Set the standard-engine linter options
    const lintOpts = {
        fix: (_a = argv.fix) !== null && _a !== void 0 ? _a : options.fix,
        globals: argv.global,
        plugins: argv.plugin,
        envs: argv.env,
        parser: argv.parser
    };
    // Figure out what files need to be parsed, use last cli arg as pattern
    const filesToLint = argv._.length !== 0 ? argv._ : DEFAULT_PATTERNS;
    // If stdin option provided then use stdin as text to lint
    let textToLint = '';
    if (argv.stdin) {
        textToLint = await getStdin();
    }
    // Perform the lint operation on the given files or text
    let report;
    try {
        report = await new Promise((resolve, reject) => {
            const cb = (err, results) => {
                if (err != null) {
                    return reject(err);
                }
                if (results == null) {
                    return reject(new Error('Linter error: No lint results returned.'));
                }
                return resolve(results);
            };
            if (argv.stdin) {
                standard.lintText(textToLint, lintOpts, cb);
            }
            else {
                standard.lintFiles(filesToLint, lintOpts, cb);
            }
        });
    }
    catch (e) {
        console.error(`${options.cmd}: Unexpected linter output:\n`);
        console.error(e.stack !== undefined ? e.stack : e.message);
        console.error(`\nIf you think this is a bug in \`${options.cmd}\`, open an issue: ${options.bugs}`);
        process.exitCode = 1;
        return;
    }
    // If the input was via stdin then write the code to stdout
    if (argv.stdin && argv.fix) {
        if (report.results[0].output !== undefined) {
            // Code contained fixable errors, so print the fixed code
            process.stdout.write(report.results[0].output);
        }
        else {
            // Code did not contain fixable errors, so print original code
            process.stdout.write(textToLint);
        }
    }
    // If no errors or warnings return success
    if (report.errorCount === 0 && report.warningCount === 0) {
        process.exitCode = 0;
        return;
    }
    // Check for any fixable rules
    const isFixable = report.results.some((res) => {
        return res.messages.some((msg) => {
            return msg.fix !== undefined;
        });
    });
    // If there were fixable rules, then that means that `--fix` was not provided
    if (isFixable) {
        console.error(`${options.cmd}: Run \`${options.cmd} --fix\` to automatically fix some problems.`);
    }
    // Check to see if a custom formatter was given, if so use that.
    const useFormatter = (_b = argv.formmatter) !== null && _b !== void 0 ? _b : options.formatter;
    let formatter;
    if (ESLINT_BUILTIN_FORMATTERS.includes(useFormatter)) {
        formatter = require(`eslint/lib/cli-engine/formatters/${useFormatter}`);
    }
    else {
        formatter = require(useFormatter);
        if (formatter == null) {
            throw new Error('Error: Unable to import custom formatter.');
        }
    }
    // print the lint results to console using the requested formatter
    console.error(formatter(report.results));
    // Only set exit code 1 if there were errors (warnings do not count)
    process.exitCode = report.errorCount > 0 ? 1 : 0;
}
exports.CLI = CLI;
