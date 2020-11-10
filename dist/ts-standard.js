"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSStandard = void 0;
const eslint = require("eslint");
const path_1 = require("path");
const standard_engine_1 = require("standard-engine");
const options_1 = require("./options");
const constants_1 = require("./constants");
class TSStandard {
    constructor(options = {}) {
        // Get the default/cli options
        const defaultOptions = options_1.getDefaultOptions(options.cwd);
        const packageOptions = options_1.getPackageOptions(options.cwd);
        options = options_1.mergeOptions(defaultOptions, packageOptions, options);
        // Linting requires a project file
        if (options.project == null) {
            throw new Error('Unable to locate the project file. A project file (tsconfig.json or ' +
                'tsconfig.eslint.json) is reqired in order to use ts-standard.');
        }
        // Handle the case where eslint lib could be a string, library, or undefined (use default lib)
        let eslintLib;
        if (typeof options.eslint === 'string') {
            eslintLib = require(options.eslint);
        }
        else if (options.eslint != null) {
            eslintLib = options.eslint;
        }
        else {
            eslintLib = eslint;
        }
        // Compile all the various options needed to construct standard-engine linter
        const standardEngineOptions = {
            cmd: constants_1.CMD,
            version: constants_1.VERSION,
            homepage: constants_1.HOMEPAGE,
            bugs: constants_1.BUGS_URL,
            tagline: constants_1.TAGLINE,
            eslint: eslintLib,
            eslintConfig: {
                configFile: path_1.resolve(path_1.join(__dirname, '../eslintrc.json')),
                cwd: options.cwd,
                parserOptions: {
                    project: options.project,
                    tsconfigRootDir: options.cwd
                }
            }
        };
        this.standardEngine = new standard_engine_1.linter(standardEngineOptions);
        // Set the standard-engine linter options
        this.defaultPerLintOptions = {
            fix: options.fix,
            globals: options.globals,
            plugins: options.plugins,
            envs: options.envs,
            parser: options.parser,
            extensions: options.extensions
        };
    }
    async lintText(text, options) {
        options = options !== null && options !== void 0 ? options : {};
        options = Object.assign(Object.assign({}, this.defaultPerLintOptions), options);
        return await new Promise((resolve, reject) => {
            this.standardEngine.lintText(text, options, (err, val) => {
                if (err != null) {
                    return reject(err);
                }
                return resolve(val);
            });
        });
    }
    async lintFiles(files, options = {}) {
        options = Object.assign(Object.assign({}, this.defaultPerLintOptions), options);
        return await new Promise((resolve, reject) => {
            this.standardEngine.lintFiles(files, options, (err, val) => {
                if (err != null) {
                    return reject(err);
                }
                return resolve(val);
            });
        });
    }
}
exports.TSStandard = TSStandard;
