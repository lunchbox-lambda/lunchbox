import { Sensor as GeneralSensor, Fn } from 'johnny-five';
import { Sensor } from '../_sensor';

export = class Default extends Sensor<GeneralSensor> {

  public init() {
    super.init();

    this.sensor = new GeneralSensor({
      pin: this.pin,
      freq: Sensor.readFrequency as any
    });

    this.sensor.on('data', () => {
      const { value } = this.sensor as any;

      const _value = Fn.map(value, 180, 1023, 100, 0);

      // console.log(`${value} ${_value}`)

      super.onSensorData({
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        soil_moisture: _value
      });
    });
  }

}
