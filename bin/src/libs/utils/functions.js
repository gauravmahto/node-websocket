"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getArgKeyVal(name, args) {
    name = (name + '=');
    const argKeyValObj = {
        arg: undefined,
        val: undefined
    };
    const argKeyVal = args.find((arg) => (arg.indexOf(name) === 0));
    if (typeof argKeyVal !== 'undefined') {
        const argKeyValArr = argKeyVal.split('=');
        if (argKeyValArr.length === 2) {
            argKeyValObj.arg = argKeyValArr[0];
            argKeyValObj.val = argKeyValArr[1];
        }
    }
    return argKeyValObj;
}
exports.getArgKeyVal = getArgKeyVal;
function dirExistsSync(dirPath) {
    try {
        return fs_1.default.statSync(dirPath).isDirectory();
    }
    catch (err) {
        return false;
    }
}
exports.dirExistsSync = dirExistsSync;
function makePathSync(targetPath) {
    const dirname = path_1.default.dirname(targetPath);
    if (dirExistsSync(dirname)) {
        return true;
    }
    makePathSync(dirname);
    fs_1.default.mkdirSync(dirname);
}
exports.makePathSync = makePathSync;
//# sourceMappingURL=functions.js.map