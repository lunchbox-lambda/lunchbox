import * as uuid from 'uuid';
import { ControllerState } from 'models';

export abstract class Controller {
  public id: string = uuid.v4()
  public state: ControllerState = ControllerState.AUTOMATIC
  public active: boolean = false

  public constructor(public type: 'pid' | 'regulator') { }

  abstract spin()

  public turnOn() {
    this.state = ControllerState.TURNED_ON;
  }

  public turnOff() {
    this.state = ControllerState.TURNED_OFF;
  }

  public reset() {
    this.state = ControllerState.AUTOMATIC;
  }

  public status(status?: any) {
    return {
      id: this.id,
      type: this.type,
      state: this.state,
      active: this.active,
      ...status,
    };
  }
}
