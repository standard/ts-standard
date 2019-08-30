"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
const pkgConf = require("pkg-conf");
const DEFAULT_TSCONFIG_LOCATIONS = [
    'tsconfig.eslint.json',
    'tsconfig.json'
];
function getTSConfigFromDefaultLocations() {
    const cwd = process.cwd();
    for (const tsFile of DEFAULT_TSCONFIG_LOCATIONS) {
        const absPath = path.join(cwd, tsFile);
        if (isValidPath(absPath)) {
            return absPath;
        }
    }
}
function isValidPath(pathToValidate) {
    try {
        fs_1.statSync(pathToValidate);
    }
    catch (e) {
        return false;
    }
    return true;
}
async function getTSConfigPathFromSettings() {
    const cwd = process.cwd();
    const res = await pkgConf('ts-standard', { cwd });
    if (res.project !== undefined) {
        const settingsPath = path.join(cwd, res.project);
        if (isValidPath(settingsPath)) {
            return settingsPath;
        }
    }
}
async function getTSConfigFile() {
    const settingsPath = await getTSConfigPathFromSettings();
    if (settingsPath !== undefined) {
        return settingsPath;
    }
    return getTSConfigFromDefaultLocations();
}
exports.getTSConfigFile = getTSConfigFile;
