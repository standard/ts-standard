"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printReport = exports.lintFiles = exports.lintStdIn = exports.cli = exports.ESLINT_BUILTIN_REPORTERS = void 0;
const getStdin = require("get-stdin");
const options_1 = require("./options");
const ts_standard_1 = require("./ts-standard");
const constants_1 = require("./constants");
exports.ESLINT_BUILTIN_REPORTERS = [
    'stylish',
    'checkstyle',
    'codeframe',
    'compact',
    'html',
    'jslint-xml',
    'json',
    'junit',
    'table',
    'tap',
    'unix',
    'visualstudio'
];
async function cli() {
    // Get the default/cli options
    const defaultOptions = options_1.getDefaultOptions();
    const packageOptions = options_1.getPackageOptions();
    const cliOptions = options_1.getCLIOptions();
    const options = options_1.mergeOptions(defaultOptions, packageOptions, cliOptions);
    // Linting requires a project file
    if (options.project == null) {
        console.error('Unable to locate the project file. A project file (tsconfig.json or ' +
            'tsconfig.eslint.json) is reqired in order to use ts-standard.');
        return process.exit(1);
    }
    const tsStandard = new ts_standard_1.TSStandard({
        project: options.project,
        fix: options.fix,
        ignore: options.ignore,
        noDefaultIgnore: options.noDefaultIgnore,
        envs: options.envs,
        globals: options.globals,
        plugins: options.plugins,
        parser: options.parser,
        eslint: options.eslint,
        cwd: options.cwd
    });
    // Perform the lint operation on the given files or text
    let lintReport;
    if (options.useStdIn) {
        lintReport = await exports.lintStdIn(tsStandard, options);
    }
    else {
        lintReport = await exports.lintFiles(tsStandard, options);
    }
    // If no errors or warnings return success
    if (lintReport.errorCount === 0 && lintReport.warningCount === 0) {
        return process.exit(0);
    }
    // Print the lint report results to console
    await exports.printReport(lintReport, options);
    // Only set exit code 1 if there were errors (warnings do not count)
    process.exit(lintReport.errorCount > 0 ? 1 : 0);
}
exports.cli = cli;
async function lintStdIn(linter, options) {
    // Get text from stdin
    const text = await getStdin();
    // Lint the text
    let lintReport;
    try {
        lintReport = await linter.lintText(text);
    }
    catch (e) {
        const err = e;
        console.error(`${constants_1.CMD}: Unexpected linter output:\n`);
        console.error(`${err.message}: ${err.stack}`);
        console.error(`\nIf you think this is a bug in \`${constants_1.CMD}\`, open an issue: ` +
            `${constants_1.BUGS_URL}`);
        return process.exit(1);
    }
    // If we performed fixes then maybe return the fixed text
    if (options.fix) {
        if (lintReport.results[0].output !== undefined) {
            // Code contained fixable errors, so print the fixed code
            process.stdout.write(lintReport.results[0].output);
        }
        else {
            // Code did not contain fixable errors, so print original code
            process.stdout.write(text);
        }
    }
    return lintReport;
}
exports.lintStdIn = lintStdIn;
async function lintFiles(linter, options) {
    // Lint the text
    let lintReport;
    try {
        lintReport = await linter.lintFiles(options.files);
    }
    catch (e) {
        const err = e;
        console.error(`${constants_1.CMD}: Unexpected linter output:\n`);
        console.error(`${err.message}: ${err.stack}`);
        console.error(`\nIf you think this is a bug in \`${constants_1.CMD}\`, open an issue: ` +
            `${constants_1.BUGS_URL}`);
        return process.exit(1);
    }
    return lintReport;
}
exports.lintFiles = lintFiles;
async function printReport(lintReport, options) {
    // Print tag line to stay consistent with standard output
    console.error(`${constants_1.CMD}: ${constants_1.TAGLINE} (${constants_1.HOMEPAGE})`);
    // Check for any fixable rules
    const isFixable = lintReport.results.some((res) => {
        return res.messages.some((msg) => {
            return msg.fix !== undefined;
        });
    });
    // If there were fixable rules, then that means that `--fix` was not provided
    if (isFixable && !options.fix) {
        console.error(`${constants_1.CMD}: Run \`${constants_1.CMD} --fix\` to automatically fix some problems.`);
    }
    // Check to see if a custom reporter was given, if so use that.
    let reporter;
    if (options.report === 'standard') {
        // Use standard reporter
        const { standardReporter } = await Promise.resolve().then(() => require('./standard-reporter'));
        reporter = standardReporter(options.useStdIn && options.fix);
    }
    else if (exports.ESLINT_BUILTIN_REPORTERS.includes(options.report)) {
        // Use built-in eslint reporter
        reporter = await Promise.resolve().then(() => require(`eslint/lib/cli-engine/formatters/${options.report}`));
    }
    else {
        // Use a custom reporter
        reporter = await Promise.resolve().then(() => require(options.report));
        if (reporter == null) {
            throw new Error('Error: Unable to import custom formatter.');
        }
    }
    // Print the lint results to console using the requested formatter
    const outputReport = reporter(lintReport.results);
    // When fixing code from stdin (`standard --stdin --fix`), the transformed
    // code is printed to stdout, so print lint errors to stderr in this case.
    if (options.useStdIn && options.fix) {
        console.error(outputReport);
    }
    else {
        console.log(outputReport);
    }
}
exports.printReport = printReport;
