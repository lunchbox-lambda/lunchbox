export type BroadcastEvent =
  'computer'
  | 'connectivity'
  | 'environment'
  | 'environment-list'
  | 'recipe-context'

export interface Broadcaster {
  start(): Promise<void>
  register(event: BroadcastEvent, provider: () => Promise<any> | Promise<any>[])
  broadcast(event: BroadcastEvent, data?: any)
}
