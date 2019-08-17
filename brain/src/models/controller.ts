import { Entity } from './entity';

export class Controller extends Entity {
  type: string
  state: ControllerState
  active: boolean
  variable?: string
  sensors?: any[]
  actuators?: any[]
  regulators?: any[]
  currentValue?: Map<string, number>
  desiredValue?: Map<string, number>
}

export enum ControllerState {
  AUTOMATIC,
  TURNED_ON,
  TURNED_OFF
}

export enum ControllerCommand {
  TURN_ON,
  TURN_OFF,
  RESET
}
