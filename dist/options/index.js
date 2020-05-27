"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOptions = void 0;
__exportStar(require("./default-options"), exports);
__exportStar(require("./cli-options"), exports);
__exportStar(require("./package-options"), exports);
// A simple utility function to merge objects together ignoring any undefined values
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
