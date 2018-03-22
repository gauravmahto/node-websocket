"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
require('app-module-path')
    .addPath(__dirname);
global.APP_ROOT_DIR = __dirname;
global.DATA_DIR = path_1.default.join(global.APP_ROOT_DIR, '..', 'data');
//# sourceMappingURL=global.js.map