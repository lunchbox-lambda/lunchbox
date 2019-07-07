import { Component } from 'lib/component'
import { Computer, Fixture } from 'models'

export interface ComputerService extends Component {
  getComputer(): Promise<Computer>
  updateComputerFixtures(fixtures: Fixture[]): Promise<Fixture[]>
  commandController(command: string, controllerId: string): Promise<void>
  restartComputer(): Promise<void>
  getSettings(): Promise<object>
  setSettings(settings: object): Promise<void>
}
