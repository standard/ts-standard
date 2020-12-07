"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isValidPath = exports._getTSConfigFromDefaultLocations = exports.getDefaultOptions = exports.DEFAULT_EXTENSIONS = exports.DEFAULT_TSCONFIG_LOCATIONS = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
exports.DEFAULT_TSCONFIG_LOCATIONS = [
    'tsconfig.eslint.json',
    'tsconfig.json'
];
exports.DEFAULT_EXTENSIONS = ['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx'];
function getDefaultOptions(cwd = process.cwd()) {
    return {
        files: [],
        project: _getTSConfigFromDefaultLocations(cwd),
        fix: false,
        report: 'standard',
        useStdIn: false,
        noDefaultIgnore: false,
        cwd,
        stdInFilename: undefined,
        eslint: undefined,
        ignore: undefined,
        envs: undefined,
        globals: undefined,
        plugins: undefined,
        parser: undefined,
        extensions: exports.DEFAULT_EXTENSIONS
    };
}
exports.getDefaultOptions = getDefaultOptions;
function _getTSConfigFromDefaultLocations(cwd) {
    for (const tsFile of exports.DEFAULT_TSCONFIG_LOCATIONS) {
        const absPath = path_1.join(cwd, tsFile);
        if (exports._isValidPath(absPath)) {
            return absPath;
        }
    }
    return undefined;
}
exports._getTSConfigFromDefaultLocations = _getTSConfigFromDefaultLocations;
function _isValidPath(pathToValidate) {
    try {
        fs_1.statSync(pathToValidate);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports._isValidPath = _isValidPath;
