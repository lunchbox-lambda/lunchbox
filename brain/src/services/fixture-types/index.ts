import { Component } from 'lib/component';
import FixtureType from 'models/fixture-type';

export interface FixtureTypeService extends Component {
  getFixtureTypes(): Promise<FixtureType[]>;
}
