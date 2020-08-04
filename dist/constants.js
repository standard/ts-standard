"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.HOMEPAGE = exports.BUGS_URL = exports.TAGLINE = exports.CMD = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');
exports.CMD = 'ts-standard';
exports.TAGLINE = 'Typescript Standard Style!';
exports.BUGS_URL = packageJson.bugs.url;
exports.HOMEPAGE = packageJson.homepage;
exports.VERSION = packageJson.version;
