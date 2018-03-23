/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import { client as WebSocketClient } from 'websocket';

import { createLogger } from 'libs/utils';

import { getIPs } from './poll-ip';

const logger = createLogger('client');

const client = new WebSocketClient();

client.on('connectFailed', (error) => {
  logger.info(`Connect Error: ${error.toString()}`);
});

client.on('connect', (connection) => {
  logger.info('WebSocket Client Connected');

  connection.on('error', (error) => {
    logger.info(`Connection Error: ${error.toString()}`);
  });

  connection.on('close', () => {
    logger.info('echo-protocol Connection Closed');
  });

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      logger.info(`Received: '${message.utf8Data}'`);
    }
  });

  // Send the IP every sec.
  (function sendIP() {
    if (connection.connected) {
      const ips = getIPs();
      const newIP = ips.find((ip) => {
        return (ip.split('.')[0] === '10');
      });

      if (typeof newIP !== 'undefined') {
        connection.sendUTF(newIP.toString());
      }

      setTimeout(sendIP, 1000);
    }
  }());

});

client.connect('ws://localhost:8080/', 'echo-protocol');
