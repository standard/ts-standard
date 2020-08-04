"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardReporter = void 0;
function standardReporter(isUsingStdInAndFix) {
    return (lintResults) => {
        const prefix = isUsingStdInAndFix ? 'ts-standard:' : ' ';
        let logResults = '';
        lintResults.forEach((res) => {
            res.messages.forEach((msg) => {
                var _a, _b, _c, _d, _e;
                logResults +=
                    prefix +
                        ` ${res.filePath}:${(_b = (_a = msg.line) === null || _a === void 0 ? void 0 : _a.toString(10)) !== null && _b !== void 0 ? _b : '0'}:` +
                        `${(_d = (_c = msg.column) === null || _c === void 0 ? void 0 : _c.toString(10)) !== null && _d !== void 0 ? _d : '0'}: ${msg.message}` +
                        ` (${(_e = msg.ruleId) !== null && _e !== void 0 ? _e : ''})\n`;
            });
        });
        return logResults.slice(0, logResults.length - 1);
    };
}
exports.standardReporter = standardReporter;
