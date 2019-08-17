import * as uuid from 'uuid';
import { ControllerState } from 'models';

export abstract class Controller {

  id: string = uuid.v4()
  state: ControllerState = ControllerState.AUTOMATIC
  active: boolean = false

  constructor(public type: 'pid' | 'regulator') { }

  abstract spin()

  turnOn() {
    this.state = ControllerState.TURNED_ON;
  }

  turnOff() {
    this.state = ControllerState.TURNED_OFF;
  }

  reset() {
    this.state = ControllerState.AUTOMATIC;
  }

  status(status?: any) {
    return {
      id: this.id,
      type: this.type,
      state: this.state,
      active: this.active,
      ...status
    };
  }

}
