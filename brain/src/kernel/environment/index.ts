import { Component } from 'lib/component';
import Computer from 'models/computer';

export interface Environment extends Component {
  computer: Computer;
  environments: string[];
  sensorReadings: Map<string, number>;
  cameraPictures: Map<string, Buffer>;
  desiredValues: Map<string, number>;
  serializeForBroadcast(environment: string);
}
