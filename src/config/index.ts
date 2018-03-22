/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

export const appConfig = {
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
      maxDays: 7, // 0 = don't delete old log files
      maxsize: 209715200, // 200 MB
      exitOnError: false,
      json: false,
      timestamp: true
    }
  }
};
