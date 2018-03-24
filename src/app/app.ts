/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import { request } from 'http';

import express from 'express';

import { appConfig } from 'config';
import { createLogger, getArgKeyVal } from 'libs/utils';

import { createWebSocketClient, registerWebSocketClient } from './client';
import { createWebSocketServer, getExistingIP, registerWebSocketServer } from './server';

// Application entry.
const logger = createLogger('app');

const app: express.Express = express();

const isProxyServer = (getArgKeyVal('mode', process.argv).val === 'proxy');

if (isProxyServer) {
  createWebSocketServer();
  registerWebSocketServer();
} else {
  createWebSocketClient();
  registerWebSocketClient();
}

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

export function triggerCIBuild(user = 'N/A', changeList = 'N/A'): void {

  logger.info(`#triggerCIBuild - Provided options - user:${user}, changeList:${changeList}.`);

  const req = request({
    host: appConfig.ciServer.address,
    port: appConfig.ciServer.port,
    method: 'GET',
    path: `/job/NodeJS/buildWithParameters?token=buildNodeJS&cause=TriggeredBy${user}&P4_CHANGELIST=${changeList}`
  });

  req.on('error', (err: any) => {
    logger.error(err);
  });

  req.end();

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

  if (isProxyServer) {
    logger.info('Proxy mode. Redirecting received request.');
    redirectReqToServer(user, changeList);
  } else {
    logger.info('Normal mode. Triggering CI build.');
    triggerCIBuild(user, changeList);
  }

  res.status(200)
    .end();

});

// Start the web-server.
app.listen(appConfig.webServer.port, appConfig.webServer.address, listener);
