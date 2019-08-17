import { Server } from 'http';
import { Express } from 'express';

export interface NodeRed {
  start(server: Server, app: Express);
}
