"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Export the real API usage class
__export(require("./ts-standard"));
// Export standard-engine compatible api for so that editor extensions work as expected
__export(require("./standard-engine-api"));
