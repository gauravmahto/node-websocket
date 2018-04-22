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

let connectionAttemptInterval = 10;
let client: WebSocketClient;

/**
 * Create a web socket client.
 */
export function createWebSocketClient(): void {
  client = new WebSocketClient();
}

/**
 * Register a web socket client and start listening for events.
 */
export function registerWebSocketClient(): void {

  if (typeof client === 'undefined') {
    logger.error('WebSocket Client is not created.');

    return;
  }

  // Connection failure listener.
  client.on('connectFailed', (error) => {
    logger.error(`Connect Error: ${error.toString()}`);
    logger.info(`Will retry the connection after ${connectionAttemptInterval} seconds.`);

    // Try connecting by throttling.
    setTimeout(() => {
      // Increment the interval by 10 secs.
      connectionAttemptInterval += 10;
      logger.info(`Connection attempt #${connectionAttemptInterval / 10}.`);
      client.connect(`ws://${appConfig.server.address}:${appConfig.server.port}/`,
        appConfig.client.protocol, appConfig.client.origin);
    }, (connectionAttemptInterval * 1000));
  });

  // Connection listener.
  client.on('connect', (connection) => {
    logger.info('WebSocket Client Connected');

    // Error listener.
    connection.on('error', (error) => {
      logger.error(`Connection Error: ${error.toString()}`);
    });

    // Close listener.
    connection.on('close', () => {
      logger.info(`${appConfig.client.protocol}: Connection Closed`);

      process.exit(1);
    });

    // Message listener.
    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        logger.info(`Received: '${message.utf8Data}'`);
      }
    });

    let lastIP: string = '';
    // Look for new IP and send the message.
    (function sendIP() {

      if (connection.connected) {
        const ips = getIPs();
        const newIP = ips.find((ip) => {
          return (ip.split('.')[0] === '10');
        });

        if (typeof newIP !== 'undefined' && lastIP !== newIP) {
          lastIP = newIP;
          connection.sendUTF(newIP.toString() + ':' + appConfig.webServer.port.toString());
        }

        // Update the IP based on set time interval.
        setTimeout(sendIP, appConfig.client.updateInterval);
      }
    }());

  });

  // Connect the client.
  client.connect(`ws://${appConfig.server.address}:${appConfig.server.port}/`,
    appConfig.client.protocol, appConfig.client.origin);

}
