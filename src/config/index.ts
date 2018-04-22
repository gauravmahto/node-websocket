/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

/**
 * Application configurations.
 */
export const appConfig = {
  log: {
    level: 'silly',
    dir: 'logs',
    console: {
      prettyPrint: true,
      colorize: true,
      exitOnError: false,
      json: false,
      timestamp: true
    },
    file: {
      filename: 'app-%DATE%.log',
      datePattern: 'MM-D-YYYY-HH',
      maxDays: 7, // 0 = don't delete old log files
      maxsize: 209715200, // 200 MB
      exitOnError: false,
      json: false,
      timestamp: true
    }
  },

  store: {
    dir: 'store',
    fileName: 'data.json',
    option: {
      autoload: true,
      autosave: true,
      autosaveInterval: 4000
    }
  },

  ciServer: {
    address: '192.168.127.135',
    port: 8080
  },

  webServer: {
    port: 8099,
    address: ''
  },

  server: {
    address: 'localhost',
    port: 3897,
    protocol: 'perforce-trigger-websocket',
    acceptOrigin: 'some-known-origin'
  },

  client: {
    updateInterval: 2000,  // In secs
    protocol: 'perforce-trigger-websocket',
    origin: 'some-known-origin'
  }
};
