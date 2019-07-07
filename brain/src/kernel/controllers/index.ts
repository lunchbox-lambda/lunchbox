import { Component } from 'lib/component'

export interface Controllers extends Component {
  turnOn(id: string)
  turnOff(id?: string)
  reset(id?: string)
  status(): any[]
}
