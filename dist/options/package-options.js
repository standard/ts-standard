"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._resolveTSConfigPath = exports.getPackageOptions = void 0;
const path_1 = require("path");
const pkg_conf_1 = require("pkg-conf");
const default_options_1 = require("./default-options");
function getPackageOptions(cwd) {
    var _a;
    const settings = (0, pkg_conf_1.sync)('ts-standard', { cwd });
    cwd = (_a = cwd !== null && cwd !== void 0 ? cwd : settings.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    return {
        files: settings.files,
        project: exports._resolveTSConfigPath(cwd, settings.project),
        fix: settings.fix,
        report: settings.report,
        ignore: settings.ignore,
        noDefaultIgnore: settings.noDefaultIgnore,
        globals: settings.globals,
        plugins: settings.plugins,
        envs: settings.envs,
        parser: settings.parser,
        eslint: settings.eslint,
        cwd,
        extensions: settings.extensions
    };
}
exports.getPackageOptions = getPackageOptions;
function _resolveTSConfigPath(cwd, settingsProjectPath) {
    if (settingsProjectPath != null) {
        if (Array.isArray(settingsProjectPath)) {
            return settingsProjectPath
                .map((p) => {
                const settingsPath = (0, path_1.join)(cwd, p);
                if ((0, default_options_1._isValidPath)(settingsPath)) {
                    return settingsPath;
                }
                return undefined;
            })
                .filter((str) => str !== undefined);
        }
        else {
            const settingsPath = (0, path_1.join)(cwd, settingsProjectPath);
            if ((0, default_options_1._isValidPath)(settingsPath)) {
                return settingsPath;
            }
        }
    }
    return undefined;
}
exports._resolveTSConfigPath = _resolveTSConfigPath;
