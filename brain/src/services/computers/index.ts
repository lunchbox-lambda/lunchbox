import { Component } from 'lib/component';
import Computer from 'models/computer';
import Fixture from 'models/fixture';

export interface ComputerService extends Component {
  getComputer(): Promise<Computer>;
  updateComputerFixtures(fixtures: Fixture[]): Promise<Fixture[]>;
  commandController(command: string, controllerId: string): Promise<void>;
  restartComputer(): Promise<void>;
  getSettings(): Promise<object>;
  setSettings(settings: object): Promise<void>;
}
