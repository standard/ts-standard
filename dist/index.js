"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// programmatic usage
const standard_engine_1 = require("standard-engine");
const options_1 = require("./options");
module.exports = new standard_engine_1.linter(options_1.getOptions());
