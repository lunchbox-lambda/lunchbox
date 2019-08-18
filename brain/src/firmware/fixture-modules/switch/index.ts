import { Switch } from 'johnny-five';
import { Sensor } from '../_sensor';

export = class Default extends Sensor<Switch> {

  public init() {
    super.init();

    this.sensor = new Switch({
      pin: this.pin
    });

    setInterval(() => {
      const isOpen = this.sensor.isOpen;
      super.onSensorData({
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        switch_status: isOpen ? 1 : 0
      });
    }, Sensor.readFrequency);

  }

}
