/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import path from 'path';

import Loki from 'lokijs';

import { appConfig } from 'config';

import { makePathSync } from './functions';
import { createLogger } from './logger';

const logger = createLogger('DataStore');

export class DataStore {

  private dataBase: Loki;
  private mDefaultCollection: Collection<any>;

  public constructor(private mConfig: typeof appConfig.store) {
  }

  public initStore(): void {

    const fileName = path.join(global.DATA_DIR, this.mConfig.dir, this.mConfig.fileName);
    // Make path to log file.
    makePathSync(fileName);

    (this.mConfig.option as any).autoloadCallback = this.createCollection.bind(this);
    this.dataBase = new Loki(fileName, this.mConfig.option);
  }

  public createCollection(name: string): Collection<any> | undefined {
    if (typeof this.dataBase !== 'undefined') {

      name = name || 'dataStore';
      let collection = this.dataBase.getCollection(name);
      if (null === collection) {
        collection = this.dataBase.addCollection(name);
      }

      this.mDefaultCollection = this.mDefaultCollection ? this.mDefaultCollection : collection;

      return collection;
    }
  }

  public get defaultCollection(): Collection<any> | undefined {
    return this.mDefaultCollection;
  }

}

export const defaultDataStore = new DataStore(appConfig.store);

logger.info('Creating default store.');
defaultDataStore.initStore();
