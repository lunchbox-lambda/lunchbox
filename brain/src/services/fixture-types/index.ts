import { Component } from 'lib/component'
import { FixtureType } from 'models'

export interface FixtureTypeService extends Component {
  getFixtureTypes(): Promise<FixtureType[]>
}
