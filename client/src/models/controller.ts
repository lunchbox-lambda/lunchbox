import Entity from './entity';

export default class Controller extends Entity {
  public type: string
  public state: ControllerState
  public active: boolean
  public variable?: string
  public sensors?: any[]
  public actuators?: any[]
  public regulators?: any[]
  public currentValue?: Map<string, number>
  public desiredValue?: Map<string, number>
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
