"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const winston = __importStar(require("winston"));
require("winston-daily-rotate-file");
const config_1 = require("config");
const functions_1 = require("./functions");
const logConfig = JSON.parse(JSON.stringify(config_1.appConfig.log));
if (logConfig.console.timestamp) {
    logConfig.console.timestamp = () => moment_1.default().format('DD-MM-YYYY HH:mm:ss');
}
if (logConfig.file.timestamp) {
    logConfig.file.timestamp = () => moment_1.default().format('DD-MM-YYYY HH:mm:ss');
}
const transports = [];
let logger;
exports.logger = logger;
if (logConfig.file) {
    const fileConfig = logConfig.file;
    fileConfig.filename = path_1.default.join(global.DATA_DIR, fileConfig.dir, fileConfig.filename);
    fileConfig.label = process.pid.toString();
    functions_1.makePathSync(fileConfig.filename);
    transports.push(new winston.transports.DailyRotateFile(fileConfig));
}
if (logConfig.console) {
    logConfig.console.label = process.pid.toString();
    transports.push(new winston.transports.Console(logConfig.console));
}
exports.logger = logger = new winston.Logger({
    transports: transports
});
logger.level = logConfig.level || 'debug';
//# sourceMappingURL=logger.js.map