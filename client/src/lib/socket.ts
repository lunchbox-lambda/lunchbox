import config from '../config'
import { TYPES, inject, injectable } from '../lib/inversify'
import { IStore, actions } from '../lib/redux'
import * as io from 'socket.io-client'

export interface ISocket {

}

@injectable()
export class Socket implements ISocket {

  private socket: SocketIOClient.Socket

  @inject(TYPES.Store)
  private store: IStore

  constructor() {

    this.socket = io.connect(config.serverHost, {
      path: '/socket'
    })

    this.socket.on('connect', () => {
      this.store.dispatch(actions.setConnectivity(
        { socket: true }
      ))
    })

    this.socket.on('disconnect', () => {
      this.store.dispatch(actions.setConnectivity(
        { broker: null, board: null, socket: false }
      ))
    })

    this.socket.on('error', event => {

    })

    ////////////////

    this.socket.on('connectivity', data => {
      this.store.dispatch(actions.setConnectivity(data))
    })

    this.socket.on('computer', data => {
      this.store.dispatch(actions.setComputer(data))
    })

    this.socket.on('environment-list', data => {
      this.store.dispatch(actions.setEnvironmentList(data))
    })

    this.socket.on('environment', data => {
      this.store.dispatch(actions.setEnvironment(data))
    })

    this.socket.on('recipe-context', data => {
      this.store.dispatch(actions.setRecipeContext(data))
    })
  }

}
