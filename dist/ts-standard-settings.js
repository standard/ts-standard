"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
const pkgConf = require("pkg-conf");
exports.DEFAULT_TSCONFIG_LOCATIONS = [
    'tsconfig.eslint.json',
    'tsconfig.json'
];
async function getTSStandardSettings() {
    var _a, _b;
    const settings = await pkgConf('ts-standard', { cwd: process.cwd() });
    // Resolve the path to the tsconfig file
    settings.project = exports._resolveTSConfigPath(settings.project);
    // set defaults
    settings.formatter = (_a = settings.formatter) !== null && _a !== void 0 ? _a : 'stylish';
    settings.fix = (_b = settings.fix) !== null && _b !== void 0 ? _b : false;
    return settings;
}
exports.getTSStandardSettings = getTSStandardSettings;
function _resolveTSConfigPath(settingsProjectPath) {
    if (settingsProjectPath !== undefined) {
        const settingsPath = path.join(process.cwd(), settingsProjectPath);
        if (exports._isValidPath(settingsPath)) {
            return settingsPath;
        }
    }
    return exports._getTSConfigFromDefaultLocations();
}
exports._resolveTSConfigPath = _resolveTSConfigPath;
function _getTSConfigFromDefaultLocations() {
    for (const tsFile of exports.DEFAULT_TSCONFIG_LOCATIONS) {
        const absPath = path.join(process.cwd(), tsFile);
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
