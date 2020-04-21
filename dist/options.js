"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const eslint = require("eslint");
const ts_standard_settings_1 = require("./ts-standard-settings");
async function getOptions() {
    const settings = await ts_standard_settings_1.getTSStandardSettings();
    return {
        // cmd, homepage, bugs all pulled from package.json
        cmd: 'ts-standard',
        version: require('../package.json').version,
        homepage: require('../package.json').homepage,
        bugs: require('../package.json').bugs.url,
        tagline: 'Standard for Typescript!',
        eslint,
        eslintConfig: {
            configFile: path_1.join(__dirname, '../eslintrc.json'),
            parserOptions: {
                project: settings.project
            }
        },
        formatter: settings.formatter,
        fix: settings.fix
    };
}
exports.getOptions = getOptions;
