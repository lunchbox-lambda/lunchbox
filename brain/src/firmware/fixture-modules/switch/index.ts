import { Switch } from 'johnny-five'
import { Sensor } from '../_sensor'

export = class Default extends Sensor<Switch> {

  init() {
    super.init()

    this.sensor = new Switch({
      pin: this.pin
    })

    setInterval(() => {
      const isOpen = this.sensor.isOpen
      super.onSensorData({
        switch_status: isOpen ? 1 : 0
      })
    }, Sensor.readFrequency)

  }

}
