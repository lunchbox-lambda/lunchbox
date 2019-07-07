import { Component } from 'lib/component'
import { Computer } from 'models'

export interface Environment extends Component {
  computer: Computer
  environments: Array<string>
  sensorReadings: Map<string, number>
  cameraPictures: Map<string, Buffer>
  desiredValues: Map<string, number>
  serializeForBroadcast(environment: string)
}
