"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isValidPath = exports._getTSConfigFromDefaultLocations = exports.getDefaultOptions = exports.DEFAULT_TSCONFIG_LOCATIONS = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
exports.DEFAULT_TSCONFIG_LOCATIONS = [
    'tsconfig.eslint.json',
    'tsconfig.json'
];
const DEFAULT_PATTERNS = [
    '**/*.js',
    '**/*.jsx',
    '**/*.mjs',
    '**/*.cjs',
    '**/*.ts',
    '**/*.tsx'
];
function getDefaultOptions(cwd = process.cwd()) {
    return {
        files: DEFAULT_PATTERNS,
        project: _getTSConfigFromDefaultLocations(cwd),
        fix: false,
        report: 'standard',
        useStdIn: false,
        noDefaultIgnore: false,
        cwd,
        eslint: undefined,
        ignore: undefined,
        envs: undefined,
        globals: undefined,
        plugins: undefined,
        parser: undefined
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
