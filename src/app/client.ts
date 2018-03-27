/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import { client as WebSocketClient } from 'websocket';

import { appConfig } from 'config';
import { createLogger } from 'libs/utils';

import { getIPs } from './ips';

const logger = createLogger('client');

let client: WebSocketClient;

export function createWebSocketClient(): void {
  client = new WebSocketClient();
}

export function registerWebSocketClient(): void {

  if (typeof client === 'undefined') {
    logger.error('WebSocket Client is not created.');

    return;
  }

  client.on('connectFailed', (error) => {
    logger.error(`Connect Error: ${error.toString()}`);
  });

  client.on('connect', (connection) => {
    logger.info('WebSocket Client Connected');

    connection.on('error', (error) => {
      logger.error(`Connection Error: ${error.toString()}`);
    });

    connection.on('close', () => {
      logger.info(`${appConfig.client.protocol}: Connection Closed`);

      process.exit(1);
    });

    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        logger.info(`Received: '${message.utf8Data}'`);
      }
    });

    let lastIP: string = '';
    // Send the IP every sec.
    (function sendIP() {

      if (connection.connected) {
        const ips = getIPs();
        const newIP = ips.find((ip) => {
          return (ip.split('.')[0] === '10');
        });

        if (typeof newIP !== 'undefined' && lastIP !== newIP) {
          lastIP = newIP;
          connection.sendUTF(newIP.toString() + appConfig.webServer.port.toString());
        }

        setTimeout(sendIP, appConfig.client.updateInterval);
      }
    }());

  });

  client.connect(`ws://${appConfig.server.address}:${appConfig.server.port}/`,
    appConfig.client.protocol, appConfig.client.origin);

}
