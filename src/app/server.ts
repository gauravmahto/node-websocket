/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import http from 'http';

import { connection, server as WebSocketServer } from 'websocket';

import { appConfig } from 'config';
import { createLogger } from 'libs/utils';

const logger = createLogger('server');

const server = http.createServer((request, response) => {
  logger.info(`Received request for ${request.url}`);
  response.writeHead(404);
  response.end();
});
server.listen(appConfig.server.port, () => {
  logger.info(`Server is listening on port ${appConfig.server.port}.`);
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  // Detect whether the specified origin is allowed.
  logger.info(`Origin: ${origin}`);

  return (appConfig.server.acceptOrigin === origin);
}

wsServer.on('request', (request) => {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin.
    request.reject();
    logger.info('Connection from origin ' + request.origin + ' rejected.');

    return;
  }

  let conn: connection | undefined;

  try {
    conn = request.accept(appConfig.server.protocol, request.origin);
  } catch (err) {
    logger.error(err);
  }

  if (typeof conn !== 'undefined') {

    logger.info('Connection accepted.');
    conn.on('message', (message) => {

      if (!conn) {
        return;
      }

      if (message.type === 'utf8') {
        logger.info('Received Message: ' + message.utf8Data);
        conn.sendUTF(message.utf8Data!);
      } else if (message.type === 'binary') {
        logger.info(`Received Binary Message of ${message.binaryData!.length} bytes.`);
        conn.sendBytes(message.binaryData!);
      }
    });

    conn.on('close', (reasonCode, description) => {
      if (conn) {
        logger.info(`Peer ${conn.remoteAddress} disconnected.`);
      }
    });

  }

});
