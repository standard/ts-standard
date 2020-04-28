"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./default-options"));
__export(require("./cli-options"));
__export(require("./package-options"));
function mergeOptions(...objects) {
    var _a;
    const result = {};
    for (const obj of objects) {
        if (obj == null) {
            continue;
        }
        const keys = Object.keys(obj);
        for (const key of keys) {
            result[key] = (_a = obj[key]) !== null && _a !== void 0 ? _a : result[key];
        }
    }
    return result;
}
exports.mergeOptions = mergeOptions;
