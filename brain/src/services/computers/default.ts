import * as fs from 'fs';
import * as path from 'path';
import config from 'config';
import settings from 'lib/settings';
import { TYPES, inject, injectable } from 'lib/inversify';
import { ComputerService } from 'services/computers';
import { Fixture, ControllerCommand } from 'models';
import { CommandCenter } from 'kernel/command-center';
import { Service } from '../service';

@injectable()
export class DefaultComputerService extends Service implements ComputerService {
  @inject(TYPES.CommandCenter) private commandCenter: CommandCenter

  public async getComputer() {
    return this.repository.getComputer();
  }

  public async updateComputerFixtures(fixtures: Fixture[]) {
    await this.repository.updateComputerFixtures(fixtures);
    const computer = await this.repository.getComputer();
    return computer.fixtures;
  }

  public async commandController(command: string, controllerId: string) {
    let controllerCommand: ControllerCommand;

    switch (command) {
      case 'turn-on':
        controllerCommand = ControllerCommand.TURN_ON;
        break;

      case 'turn-off':
        controllerCommand = ControllerCommand.TURN_OFF;
        break;

      case 'reset':
        controllerCommand = ControllerCommand.RESET;
        break;

      default: throw new Error('Invalid command');
    }

    this.commandCenter.commandController(controllerCommand, controllerId);
  }

  public async restartComputer() {
    this.commandCenter.restartComputer();
  }

  public async getSettings() {
    return Promise.resolve(settings);
  }

  public async setSettings(settings: object) {
    const data = JSON.stringify(settings, null, '    ');
    const filePath = path.resolve(config.data.path, 'settings.json');
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, data, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}
