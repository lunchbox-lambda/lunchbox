import logger from 'lib/logger';
import { TYPES, inject, injectable } from 'lib/inversify';
import { CommandCenter } from 'kernel/command-center';
import { RecipeCommand } from 'models/recipe';
import { ControllerCommand } from 'models/controller';
import { Controllers } from 'kernel/controllers';
import { RecipeManager } from 'kernel/recipe-manager';

const log = logger('kernel:command-center');

@injectable()
export default class DefaultCommandCenter implements CommandCenter {
  @inject(TYPES.Controllers) private controllers: Controllers
  @inject(TYPES.RecipeManager) private recipeManager: RecipeManager

  public async init() {
    log('init');
  }

  public restartComputer() {
    process.nextTick(() => process.exit());
  }

  public commandRecipe(environment: string, command: RecipeCommand, recipeId?: string) {
    this.recipeManager.command(environment, command, recipeId);
  }

  public commandController(command: ControllerCommand, controllerId: string) {
    log(`controller ${controllerId} ${ControllerCommand[command]}`);
    switch (command) {
      case ControllerCommand.TURN_ON:
        this.controllers.turnOn(controllerId);
        break;

      case ControllerCommand.TURN_OFF:
        this.controllers.turnOff(controllerId);
        break;

      case ControllerCommand.RESET:
        this.controllers.reset(controllerId);
        break;

      default: throw new Error('Invalid command');
    }
  }
}
