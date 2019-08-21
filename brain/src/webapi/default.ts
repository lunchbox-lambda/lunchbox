import config from 'config';
import * as http from 'http';
import logger from 'lib/logger';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { TYPES, inject, injectable } from 'lib/inversify';
import { WebApi } from 'webapi';
import { Router } from 'webapi/router';
import { Socket } from 'lib/socket';
import { NodeRed } from 'lib/node-red';
import { Broadcaster } from 'lib/broadcaster';

const log = logger('webapi:server');

@injectable()
export class DefaultWebApi implements WebApi {
  @inject(TYPES.Router) private router: Router
  @inject(TYPES.Socket) private socket: Socket
  @inject(TYPES.NodeRed) private nodeRed: NodeRed
  @inject(TYPES.Broadcaster) private broadcaster: Broadcaster

  public async init() {
    log('init');

    const app = express();
    const server = http.createServer(app);

    await this.socket.init(server);

    await this.broadcaster.start();

    app.use(compression());
    app.use(bodyParser.json({ limit: '1Mb' }));

    await this.nodeRed.start(server, app);
    await this.router.config(app);

    await server.listen(config.server.port);
    log(`listening on port ${config.server.port}`);
  }
}
