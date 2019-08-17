import { Actuator } from '../_actuator';
import { Led } from 'johnny-five';

export = class Default extends Actuator<Led> {

  init() {
    super.init();

    this.actuator = new Led({
      pin: this.pin as number
    });

    this.observable.subscribe(value => {
      if (value.state === 'on')
        this.actuator.on();

      else if (value.state === 'off')
        this.actuator.off();
    });
  }

}