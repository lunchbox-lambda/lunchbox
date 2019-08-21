import { Relay } from 'johnny-five';
import { Regulator } from '../_regulator';

export = class Default extends Regulator<Relay> {
  public init() {
    super.init();

    this.regulator = new Relay({
      pin: this.pin,
      type: 'NC',
    });

    this.observable.subscribe((value) => {
      if (value.state === 'on') {
        this.regulator.close();
      } else if (value.state === 'off') {
        this.regulator.open();
      }
    });
  }
}
