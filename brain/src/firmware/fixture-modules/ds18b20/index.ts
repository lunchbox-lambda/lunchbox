import { Thermometer } from 'johnny-five';
import { Sensor } from '../_sensor';

export = class Default extends Sensor<Thermometer> {
  public init() {
    super.init();

    this.sensor = new Thermometer({
      controller: 'DS18B20',
      pin: this.pin,
      freq: Sensor.readFrequency as any,
    });

    this.sensor.on('data', (data) => {
      super.onSensorData({
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        air_temperature: data.celsius,
      });
    });
  }
}
