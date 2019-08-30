"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./cli");
const options_1 = require("./options");
async function run() {
    const options = await options_1.getOptions();
    await cli_1.CLI(options);
}
exports.run = run;
