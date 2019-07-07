import { Observable } from 'rxjs'
import { Component } from 'lib/component'
import { Regulator } from 'firmware/fixture-modules/_regulator'
import { Actuator } from 'firmware/fixture-modules/_actuator'
import { Sensor, SensorEvent } from 'firmware/fixture-modules/_sensor'
import { Camera, CameraEvent } from 'firmware/fixture-modules/_camera'

export interface Peripherals extends Component {
  sensors: Sensor<any>[]
  actuators: Actuator<any>[]
  regulators: Regulator<any>[]
  cameras: Camera<any>[]
  sensorEvents: Observable<SensorEvent>
  cameraEvents: Observable<CameraEvent>
  status(): { sensors: any[], actuators: any[], regulators: any[], cameras: any[] }
}
