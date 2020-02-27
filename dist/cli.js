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
async function CLI(options) {
    const standard = new standard_engine_1.linter(options);
    options = Object.assign({ cmd: 'standard-engine', tagline: 'JavaScript Custom Style', version: '0.0.0' }, options);
    const argv = minimist(process.argv.slice(2), {
        alias: {
            global: 'globals',
            plugin: 'plugins',
            env: 'envs',
            help: 'h',
            verbose: 'v',
            project: 'p'
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
    if (argv.help) {
        if (options.tagline !== undefined)
            console.log('%s - %s (%s)', options.cmd, options.tagline, options.homepage);
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
        --parser    Use custom js parser (e.g. babel-eslint)
    -p, --project   Use custom tsconfig file to get type information
    `);
        process.exitCode = 0;
        return;
    }
    if (argv.version) {
        console.log(options.version);
        process.exitCode = 0;
        return;
    }
    if (argv.project !== undefined) {
        if (options.eslintConfig.parserOptions === undefined) {
            options.eslintConfig.parserOptions = {};
        }
        options.eslintConfig.parserOptions.project = argv.project;
    }
    const lintOpts = {
        fix: argv.fix,
        globals: argv.global,
        plugins: argv.plugin,
        envs: argv.env,
        parser: argv.parser
    };
    const filesToLint = argv._.length !== 0 ? argv._ : DEFAULT_PATTERNS;
    let textToLint = '';
    if (argv.stdin) {
        textToLint = await getStdin();
    }
    let result;
    try {
        result = await new Promise((resolve, reject) => {
            const cb = (err, results) => {
                if (err != null)
                    return reject(err);
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
    if (argv.stdin && argv.fix) {
        if (result.results[0].output !== undefined) {
            // Code contained fixable errors, so print the fixed code
            process.stdout.write(result.results[0].output);
        }
        else {
            // Code did not contain fixable errors, so print original code
            process.stdout.write(textToLint);
        }
    }
    if (result.errorCount === 0 && result.warningCount === 0) {
        process.exitCode = 0;
        return;
    }
    console.error(`${options.cmd}: ${options.tagline} (${options.homepage})`);
    // Are any fixable rules present?
    const isFixable = result.results.some((res) => {
        return res.messages.some((msg) => {
            return msg.fix !== undefined;
        });
    });
    if (isFixable) {
        console.error(`${options.cmd}: Run \`${options.cmd} --fix\` to automatically fix some problems.`);
    }
    result.results.forEach((res) => {
        res.messages.forEach((msg) => {
            var _a;
            log(`  ${res.filePath}:${msg.line !== undefined ? msg.line.toString(10) : '0'}:` +
                `${msg.column !== undefined ? msg.column.toString(10) : '0'}: ${msg.message}` +
                `${argv.verbose ? ` (${(_a = msg.ruleId) !== null && _a !== void 0 ? _a : ''})` : ''}`);
        });
    });
    process.exitCode = result.errorCount > 0 ? 1 : 0;
    /**
     * Print lint errors to stdout -- this is expected output from `standard-engine`.
     * Note: When fixing code from stdin (`standard --stdin --fix`), the transformed
     * code is printed to stdout, so print lint errors to stderr in this case.
     */
    function log(...args) {
        if (argv.stdin && argv.fix) {
            args[0] = `${options.cmd}: ${args[0]}`;
            console.error(...args);
        }
        else {
            console.log(...args);
        }
    }
}
exports.CLI = CLI;
