/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import http from 'http';

import { server as WebSocketServer } from 'websocket';

import { createLogger } from 'libs/utils';

const logger = createLogger('server');

const server = http.createServer((request, response) => {
  logger.info(`Received request for ${request.url}`);
  response.writeHead(404);
  response.end();
});
server.listen(8080, () => {
  logger.info('Server is listening on port 8080');
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

  return true;
}

wsServer.on('request', (request) => {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin.
    request.reject();
    logger.info('Connection from origin ' + request.origin + ' rejected.');

    return;
  }

  const connection = request.accept('echo-protocol', request.origin);

  logger.info('Connection accepted.');
  connection.on('message', (message) => {

    if (message.type === 'utf8') {
      logger.info('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data!);
    } else if (message.type === 'binary') {
      logger.info(`Received Binary Message of ${message.binaryData!.length} bytes`);
      connection.sendBytes(message.binaryData!);
    }
  });

  connection.on('close', (reasonCode, description) => {
    logger.info(`Peer ${connection.remoteAddress} disconnected.`);
  });

});
