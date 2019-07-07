import { Observable } from 'rxjs'
import { Server as HttpServer } from 'http'
import { Server as HttpsServer } from 'https'

export interface Socket extends SocketNode {
  init(server: HttpServer | HttpsServer): Promise<void>
  onConnection(): Observable<SocketNode>
  connectionCount(): number
}

export interface SocketNode {
  emit(event: string, data: any)
}
