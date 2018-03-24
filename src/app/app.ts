/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import { request } from 'http';

import express from 'express';

import { appConfig } from 'config';
import { createLogger } from 'libs/utils';

import { createWebSocketServer, getExistingIP, registerWebSocketServer } from './server';

// Application entry.
const logger = createLogger('app');

const app: express.Express = express();

createWebSocketServer();
registerWebSocketServer();

function redirectReqToServer(user: string, changeList: string): void {

  const existingData = getExistingIP();

  if (existingData.length === 1) {

    const req = request({
      host: existingData[0].ip,
      port: existingData[0].port,
      method: 'GET',
      path: `/processP4Trigger/${user}/${changeList}`
    });

    req.on('error', (err: any) => {
      logger.error(err);
    });

    req.end();

  }

}

function listener(err: NodeJS.ErrnoException) {

  if (err) {
    logger.error(`Unable to start server. Error: ${err}`);
  } else {
    logger.info('Web Server is now listening. Info: ' +
      `${appConfig.webServer.address || '0.0.0.0'}:${appConfig.webServer.port}`);
  }

}

// Register default route.
app.get('/processP4Trigger/:user/:changeList', (req, res) => {

  const user = req.params.user;
  const changeList = req.params.changeList;

  logger.info(`Received req: user: ${user}, changeList: ${changeList}`);
  redirectReqToServer(user, changeList);

  res.status(200)
    .end();

});

// Start the web-server.
app.listen(appConfig.webServer.port, appConfig.webServer.address, listener);
