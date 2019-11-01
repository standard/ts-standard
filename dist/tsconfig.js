"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
const pkgConf = require("pkg-conf");
exports.DEFAULT_TSCONFIG_LOCATIONS = [
    'tsconfig.eslint.json',
    'tsconfig.json'
];
class TSConfig {
    constructor() {
        this.cwd = process.cwd();
    }
    getConfigFilePath() {
        const settingsPath = this._getTSConfigPathFromSettings();
        if (settingsPath !== undefined) {
            return settingsPath;
        }
        return this._getTSConfigFromDefaultLocations();
    }
    _getTSConfigPathFromSettings() {
        const res = pkgConf.sync('ts-standard', { cwd: this.cwd });
        if (res.project !== undefined) {
            const settingsPath = path.join(this.cwd, res.project);
            if (this._isValidPath(settingsPath)) {
                return settingsPath;
            }
        }
    }
    _getTSConfigFromDefaultLocations() {
        for (const tsFile of exports.DEFAULT_TSCONFIG_LOCATIONS) {
            const absPath = path.join(this.cwd, tsFile);
            if (this._isValidPath(absPath)) {
                return absPath;
            }
        }
    }
    _isValidPath(pathToValidate) {
        try {
            fs_1.statSync(pathToValidate);
        }
        catch (e) {
            return false;
        }
        return true;
    }
}
exports.TSConfig = TSConfig;
