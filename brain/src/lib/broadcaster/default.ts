import { TYPES, inject, injectable } from 'lib/inversify';
import { Broadcaster, BroadcastEvent } from 'lib/broadcaster';
import { Socket, SocketNode } from 'lib/socket';

interface Broadcast {
  event: BroadcastEvent;
  provider: () => Promise<any> | Promise<any>[];
}

@injectable()
export default class DefaultBroadcaster implements Broadcaster {
  @inject(TYPES.Socket) private socket: Socket
  private broadcasts: Map<BroadcastEvent, Broadcast> = new Map()

  public async start() {
    this.socket.onConnection().subscribe((client) => {
      this.broadcasts.forEach((broadcast) => {
        this.doBroadcast(broadcast, null, client);
      });
    });
  }

  public register(event: BroadcastEvent, provider: () => Promise<any> | Promise<any>[]) {
    const broadcast = { event, provider };
    this.broadcasts.set(event, broadcast);
  }

  public broadcast(event: BroadcastEvent, data?: any) {
    const broadcast = this.broadcasts.get(event);
    this.doBroadcast(broadcast, data);
  }

  private async doBroadcast(broadcast: Broadcast, data: any, socket: SocketNode = this.socket) {
    if (!broadcast) return;

    const connectionCount = this.socket.connectionCount();
    if (connectionCount === 0) return;

    const { event, provider } = broadcast;

    if (data) socket.emit(event, data);
    else {
      const resolvers = provider();
      (resolvers instanceof Array ? resolvers : [resolvers])
        .forEach(async (resolver) => {
          socket.emit(event, await resolver);
        });
    }
  }
}
