import { Led } from 'johnny-five';
import { Actuator } from '../_actuator';

export = class Default extends Actuator<Led> {
  public init() {
    super.init();

    this.actuator = new Led({
      pin: this.pin as number,
    });

    this.observable.subscribe((value) => {
      if (value.state === 'on') {
        this.actuator.on();
      } else if (value.state === 'off') {
        this.actuator.off();
      }
    });
  }
}
