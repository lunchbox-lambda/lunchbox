import logger from 'lib/logger';
import * as socketio from 'socket.io';
import { injectable } from 'lib/inversify';
import { Subject, Observable } from 'rxjs';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { Socket, SocketNode } from 'lib/socket';

const log = logger('webapi:socket-io');

@injectable()
export class SocketIO implements Socket {

  private io: SocketIO.Server
  private subject = new Subject<SocketNode>()
  private observable = this.subject.asObservable()
  private connectCounter: number = 0

  public async init(server: HttpServer | HttpsServer): Promise<void> {
    log(`init`);

    this.io = socketio(server, {
      path: '/socket'
    });

    this.io.on('connection', client => {
      log(`connected ${client.id}`);
      this.connectCounter++;


      client.on('disconnect', () => {
        log(`disconnected ${client.id}`);
        this.connectCounter--;
      });

      this.subject.next(client);
    });
  }

  public emit(event: string, data: any) {
    this.io.emit(event, data);
  }

  public onConnection(): Observable<SocketNode> {
    return this.observable;
  }

  public connectionCount(): number {
    return this.connectCounter;
  }

}
