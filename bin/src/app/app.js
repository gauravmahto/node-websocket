"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
require("../global");
const util_1 = __importDefault(require("util"));
const utils_1 = require("libs/utils");
utils_1.logger.info('** App entry **');
const args = [];
if (require.main === module) {
    args.push(...process.argv.slice(2));
    utils_1.logger.info('Passed args:', util_1.default.inspect(args));
}
else {
}
//# sourceMappingURL=app.js.map