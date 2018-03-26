/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import '../global';

import { request } from 'http';
import process from 'process';

import { createLogger, getArgKeyVal } from 'libs/utils';

const logger = createLogger('make-request');

export function makeTriggerRequest({ user = '_', changeList = '_',
  server = '127.0.0.1', port = 80 } = {}): void {

  const req = request({
    host: server,
    port: port,
    method: 'GET',
    path: `/processP4Trigger/${user}/${changeList}`
  });

  req.on('error', (err: any) => {
    logger.error(err);
  });

  req.end();

}

const oServer = getArgKeyVal('server', process.argv).val;
const oChangeList = getArgKeyVal('changelist', process.argv).val;
const oUser = getArgKeyVal('user', process.argv).val;
let oPort = Number(getArgKeyVal('port', process.argv).val);

oPort = Number.isNaN(oPort) ? 80 : oPort;

makeTriggerRequest({
  user: oUser || '_',
  server: oServer || '127.0.0.1',
  port: oPort,
  changeList: oChangeList || '_'
});
