import config from 'config';
import { Server } from 'http';
import logger from 'lib/logger';
import * as RED from 'node-red';
import { Express } from 'express';
import { NodeRed } from 'lib/node-red';
import { injectable } from 'lib/inversify';

const log = logger('lib:node-red');
const settings = config.nodered;

@injectable()
export class DefaultNodeRed implements NodeRed {

  async start(server: Server, app: Express) {
    log('init');

    settings.logging = {
      logger: {
        level: 'error',
        handler: (settings) =>
          message => log(JSON.stringify(message), 'error')
      }
    };

    await RED.init(server, settings);

    app.use(settings.httpAdminRoot, RED.httpAdmin);
    app.use(settings.httpNodeRoot, RED.httpNode);

    await RED.start();

    log('started');
  }

}
