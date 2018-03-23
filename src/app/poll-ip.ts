/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import { networkInterfaces } from 'os';

import { createLogger } from 'libs/utils';

const logger = createLogger('poll-ip');

export function getIPs(): string[] {

  const ifaces = networkInterfaces();

  const ips: string[] = [];

  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0;

    ifaces[ifname].forEach((iface) => {

      if (('IPv4' !== iface.family) || (false !== iface.internal)) {
        // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses.
        return;
      }

      if (alias >= 1) {
        // This single interface has multiple ipv4 addresses.
        // logger.info(`${ifname} #${alias}: ${iface.address}`);
      } else {
        // This interface has only one ipv4 address.
        logger.info(`Found: ${ifname}: ${iface.address}`);
        ips.push(iface.address);
      }

      ++alias;
    });

  });

  return ips;

}
