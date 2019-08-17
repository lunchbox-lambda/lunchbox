import { Actuator } from '../_actuator';
import { Relay } from 'johnny-five';

export = class Default extends Actuator<Relay> {

  public init() {
    super.init();

    this.actuator = new Relay({
      pin: this.pin,
      type: 'NC'
    });

    this.observable.subscribe(value => {
      if (value.state === 'on')
        this.actuator.close();

      else if (value.state === 'off')
        this.actuator.open();
    });
  }

}
