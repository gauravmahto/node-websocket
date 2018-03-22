"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = {
    log: {
        level: 'silly',
        console: {
            label: 'app',
            prettyPrint: true,
            colorize: true,
            exitOnError: false,
            json: false,
            timestamp: true
        },
        file: {
            label: 'app',
            filename: 'app-%DATE%.log',
            dir: 'logs',
            datePattern: 'MM-D-YYYY-HH',
            maxDays: 7,
            maxsize: 209715200,
            exitOnError: false,
            json: false,
            timestamp: true
        }
    }
};
//# sourceMappingURL=index.js.map